package com.tnp.tnpbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student addStudent(Student student) {
        // Encode the password before saving
        student.setPassword(passwordEncoder.encode(student.getPassword()));

        // Ensure the role is valid and prefixed with "ROLE_"
        String role = student.getRole();
        if (role == null || role.isEmpty()) {
            // Default to ROLE_STUDENT if no role is provided
            student.setRole(Role.ROLE_STUDENT);
        } else if (!role.startsWith("ROLE_")) {
            // Prefix with "ROLE_" if not already present
            student.setRole("ROLE_" + role);
        }

        return studentRepository.save(student);
    }
}