package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.StudentService;

@RestController
@RequestMapping("/tnp/student")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/addStudent")
  public Student addStudent(@RequestBody Student student) {
    return studentService.addStudent(student);
  }

  @GetMapping("/dashboard")
  public String studentDashboard() {
    return "Student logged in";
  }

  @PostMapping("/update-profile")
  public boolean updateProfile(@RequestBody Student student) {
    boolean exists = studentRepository.existsByUsername(student.getUsername());
    if (!exists) {
      return false;
    }

    Student existingStudent = studentRepository.findByUsername(student.getUsername())
        .orElseThrow(() -> new RuntimeException("Student not found despite existence check"));

    existingStudent.setStudentName(student.getStudentName());
    existingStudent.setEmail(student.getEmail());
    existingStudent.setCgpa(student.getCgpa());
    existingStudent.setResumeURL(student.getResumeURL());
    existingStudent.setBacklogs(student.getBacklogs());
    existingStudent.setGraduationYear(student.getGraduationYear());
    existingStudent.setContactNumber(student.getContactNumber());
    existingStudent.setSkills(student.getSkills());

    if (student.getPassword() != null && !student.getPassword().isBlank()) {
      existingStudent.setPassword(passwordEncoder.encode(student.getPassword()));
    }

    existingStudent.setUpdatedAt(student.getUpdatedAt() != null ? student.getUpdatedAt() : LocalDate.now());

    existingStudent.setRole(student.getRole());

    studentRepository.save(existingStudent);
    return true;
  }
}