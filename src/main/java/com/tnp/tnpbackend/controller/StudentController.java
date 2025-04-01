package com.tnp.tnpbackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.dto.ApplicationRequest;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.PlacementService;
import com.tnp.tnpbackend.service.RecruiterService;
import com.tnp.tnpbackend.service.StudentService;

@RestController
@RequestMapping("/tnp/student")
public class StudentController {

  @Autowired
  private StudentService studentService;

  @Autowired
  private PlacementService placementService;

  @Autowired
  private RecruiterService recruiterService;

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

  @PostMapping("/apply")
  public ResponseEntity<String> applyToRecruiter(@RequestBody ApplicationRequest request) {
    placementService.applyToRecruiter(request.getStudentId(), request.getRecruiterId());
    return ResponseEntity.ok("Application submitted");
  }

  @GetMapping("/recruiter/{recruiterId}/students")
  public ResponseEntity<List<Student>> getStudentsForRecruiter(@PathVariable String recruiterId) {
    return ResponseEntity.ok(placementService.getStudentsForRecruiter(recruiterId));
  }

  @GetMapping("/all-companies")
  public ResponseEntity<List<?>> getAllCompanies() {
    return ResponseEntity.ok(recruiterService.getAllRecruiters());
  }
}