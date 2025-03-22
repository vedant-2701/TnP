package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.StudentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/tnp/student")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @PostMapping("/addStudent")
  public Student addStudent(@RequestBody Student student) {
    student.toString();
    return studentService.addStudent(student);
  }

  @GetMapping("/dashboard")
  public String studentDashboard() {

    return "Student logged in";
  }

  @PostMapping("/update-profile")
  public boolean updateProfile() {
    
    return false;
  }
}
