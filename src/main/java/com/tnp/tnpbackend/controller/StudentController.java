package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.StudentService;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/tnp/v1/api")
public class StudentController {


 @Autowired
 private StudentService studentService;



 @PostMapping("/addStudent")
 public Student addStudent(@RequestBody Student student){
   student.toString();
    return studentService.addStudent(student);
 }

    
    
}
