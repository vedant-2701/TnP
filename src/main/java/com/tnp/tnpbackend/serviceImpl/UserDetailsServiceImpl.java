package com.tnp.tnpbackend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
        String role = student.getRole();
        // Ensure the role has the "ROLE_" prefix
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new org.springframework.security.core.userdetails.User(
            student.getUsername(),
            student.getPassword(),
            Collections.singleton(new SimpleGrantedAuthority(role))
        );
    }
}