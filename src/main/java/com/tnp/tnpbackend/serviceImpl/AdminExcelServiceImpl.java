package com.tnp.tnpbackend.serviceImpl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.AdminExcelService;

@Service
public class AdminExcelServiceImpl implements AdminExcelService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void save(List<Student> students) {
        if (students == null || students.isEmpty()) {
            throw new IllegalArgumentException("Student list is null or empty");
        }
        try {
            System.out.println("Saving students: " + students);
            for (Student student : students) {
                student.setPassword(passwordEncoder.encode(student.getPassword()));
            }
            System.out.println("Students after setting IDs: " + students);
            studentRepository.saveAll(students);
            System.out.println("Students saved successfully");
        } catch (Exception e) {
            System.err.println("Error saving students: " + e.getMessage());
            throw new RuntimeException("Failed to save students to database", e);
        }
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}