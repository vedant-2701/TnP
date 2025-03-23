package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.service.StudentService;

@RestController
@RequestMapping("/tnp/student")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @PostMapping("/addStudent")
  public ResponseEntity<?> addStudent(@RequestBody StudentDTO studentDTO) {
    StudentDTO savStudentDTO = studentService.addStudent(studentDTO);
    return ResponseEntity.ok(savStudentDTO);
  }

  @GetMapping("/dashboard")
  public String studentDashboard() {
    return "Student logged in";
  }

  @PostMapping("/update-profile")
  public ResponseEntity<?> updateProfile(@RequestBody StudentDTO studentDTO) {
    StudentDTO updatedstudentDTO = studentService.updateProfile(studentDTO);
    return ResponseEntity.ok(updatedstudentDTO);

  }
}