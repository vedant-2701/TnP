package com.tnp.tnpbackend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.exception.AccountAlreadyDeactivatedException;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.AdminRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.repository.TnpHeadRepository;
import com.tnp.tnpbackend.service.AppUser;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TnpHeadRepository tnpHeadRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        
        if (user instanceof Student && !((Student) user).isActive()) {
            throw new AccountAlreadyDeactivatedException("User account is deactivated: " + username);
        }
        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "ROLE_STUDENT"; // Default role if none provided
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role; // Ensure ROLE_ prefix for Spring Security
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(role)));
    }

    @Cacheable("users") // Cache the user object
    public AppUser findUserByUsername(String username) {
        if (username.startsWith("admin")) {
            return adminRepository.findByUsername(username).orElse(null);
        } else if (username.matches("\\d+")) { // Numeric usernames = students
            return studentRepository.findByUsername(username).orElse(null);
        } else if (username.startsWith("head")) {
            return tnpHeadRepository.findByUsername(username).orElse(null);
        }
        return null;
    }
}

// else if (username.startsWith("tnp_")) {
// return tpoHeadRepository.findByUsername(username).orElse(null);
// } else if (username.startsWith("tnpdept_")) {
// return deptTpoRepository.findByUsername(username).orElse(null);