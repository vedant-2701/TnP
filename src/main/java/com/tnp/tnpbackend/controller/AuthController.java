package com.tnp.tnpbackend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.tnp.tnpbackend.dto.AuthRequest;
import com.tnp.tnpbackend.dto.AuthResponse;
import com.tnp.tnpbackend.security.JwtUtil;
import com.tnp.tnpbackend.service.AppUser;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
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
}