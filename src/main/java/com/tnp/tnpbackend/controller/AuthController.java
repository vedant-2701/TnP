package com.tnp.tnpbackend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.tnp.tnpbackend.dto.AuthRequest;
import com.tnp.tnpbackend.dto.AuthResponse;
import com.tnp.tnpbackend.exception.AccountAlreadyDeactivatedException;
import com.tnp.tnpbackend.exception.StudentNotFoundException;
import com.tnp.tnpbackend.security.JwtUtil;
import com.tnp.tnpbackend.service.AppUser;
import com.tnp.tnpbackend.serviceImpl.OTPServiceImpl;
import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;
import com.tnp.tnpbackend.serviceImpl.UserDetailsServiceImpl;

@RestController
@RequestMapping("/tnp/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OTPServiceImpl otpService; 

    @Autowired
    private StudentServiceImpl studentService;

    //login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try{
            System.out.println(request.toString());

        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        // Fetch the user entity using the service
        AppUser user = userDetailsService.findUserByUsername(userDetails.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found after authentication");
        }

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUsername(userDetails.getUsername());

        // Remove "ROLE_" prefix for frontend consistency
        String role = user.getRole();
        if (role != null && role.startsWith("ROLE_")) {
            role = role.substring(5);
        }
        response.setRole(role != null ? role : "USER"); // Default to "USER" if role is null

        return ResponseEntity.ok(response);
        }
        catch(InternalAuthenticationServiceException e){
            Throwable cause = e.getCause();
            if (cause instanceof AccountAlreadyDeactivatedException) {
                throw new AccountAlreadyDeactivatedException("User account is deactivated: " + request.getUsername(), cause);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Authentication service error: " + e.getMessage());
        }
    }

    // Validate the token
    @PostMapping("/validate-token/{token}")
    public ResponseEntity<?> validateToken(@PathVariable("token") String token) {
        boolean isValid = jwtUtil.validateToken(token);
        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);

        if (isValid) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            otpService.generateAndSendOTP(email);
            return ResponseEntity.ok("OTP sent to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOTP(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String otp = request.get("otp");
        try {
            boolean isValid = otpService.verifyOTP(email, otp);
            response.put("verified", isValid);
            if (isValid) {
                studentService.markEmailVerified(email);
                response.put("message", "Email verified successfully");
            } else {
                response.put("message", "Invalid or expired OTP");
            }
            return ResponseEntity.ok(response);
        } catch (StudentNotFoundException e) {
            response.put("verified", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("verified", false);
            response.put("message", "Error verifying OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}