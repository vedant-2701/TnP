package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.dto.AuthRequest;
import com.tnp.tnpbackend.dto.AuthResponse;
import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.security.JwtUtil;



@RestController
@RequestMapping("/tnp/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

 
    // @PostMapping("/signup")
    // public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    //     if (studentRepository.existsByUsername(request.getUsername())) {
    //         return ResponseEntity.badRequest().body("Username already exists");
    //     }

    //     Student student = new Student();
    //     student.setUsername(request.getUsername());
    //     student.setPassword(passwordEncoder.encode(request.getPassword()));
    //     Role role = Role.valueOf("ROLE_USER");
    //     student.setRole(role);

    //     userRepository.save(user);

    //     return ResponseEntity.ok("User registered successfully");
    // }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        System.out.println(request.toString());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

       Student student = studentRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        System.out.println(student);
        System.out.println(request.getUsername());
        System.out.println(request.getPassword());
        // System.out.println(userDetails);
        // System.out.println(userDetails.getUsername());
        // System.out.println(student.getRole().name());
        response.setUsername(userDetails.getUsername());
        response.setRole(student.getRole());

        return ResponseEntity.ok(response);
    }

}


