package com.tnp.tnpbackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.dto.AddRecruiterResponse;
import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.serviceImpl.AdminServiceImpl;
import com.tnp.tnpbackend.serviceImpl.RecruiterServiceImpl;
import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;

@RestController
@RequestMapping("/tnp/head")
public class TnpController {

    @Autowired
    private StudentServiceImpl studentService;

    @Autowired
    private RecruiterServiceImpl recruiterService;

    @Autowired
    private AdminServiceImpl adminService;

    @GetMapping("/getAllStudents")
    public ResponseEntity<?> getAllStudents() {
        List<StudentSummaryDTO> students = studentService.getAllStudents();
        // System.out.println(students);
        if (students.isEmpty() || students == null) {
            return ResponseEntity.status(404).body("No students found.");
        }
        return ResponseEntity.ok(students);
    }

    // for getting student by id
    @GetMapping("/getStudent/{id}")
    public ResponseEntity<?> getStudent(@PathVariable("id") String id) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid ID provided.");
        }
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    // for getting students by department
    @GetMapping("/getStudentsByDepartment/{department}")
    public ResponseEntity<?> getStudentsByDepartment(@PathVariable("department") String department) {
        List<StudentSummaryDTO> students = studentService.getStudentsByDepartment(department);
        if (students.isEmpty()) {
            return ResponseEntity.status(404).body("No students found in the specified department.");
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/getDepartment")
    public ResponseEntity<?> getDepartment() {
        List<String> departments = studentService.findDistinctDepartments();
        return ResponseEntity.ok(departments);
    }

    @PostMapping("/job-posting")
    public ResponseEntity<?> addRecruiter(@RequestBody RecruiterDTO recruiterDTO) {
        try {
            AddRecruiterResponse response = recruiterService.addRecruiter(recruiterDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while adding the recruiter: " + e.getMessage());
        }
    }

    // analytics code

    // Pie chart - status wise applied, interviewed, hired
    @GetMapping("/analytics/application-status")
    public ResponseEntity<Map<String, Long>> getApplicationStatusAnalytics() {
        return ResponseEntity.ok(adminService.getApplicationStatusAnalytics());
    }

    // Bar chart - number of students per department
    @GetMapping("/analytics/students-by-department")
    public ResponseEntity<Map<String, Long>> getStudentsByDepartmentAnalytics() {
        return ResponseEntity.ok(adminService.getStudentsByDepartmentAnalytics());
    }

    // Placement Success Rate by Department
    @GetMapping("/analytics/placement-success-rate")
    public ResponseEntity<Map<String, Double>> getPlacementSuccessRateAnalytics() {
        return ResponseEntity.ok(adminService.getPlacementSuccessRateAnalytics());
    }

    // Top recruiters based on number of students hired
    @GetMapping("/analytics/top-recruiters")
    public ResponseEntity<List<Map<String, Object>>> getTopRecruitersAnalytics() {
        return ResponseEntity.ok(adminService.getTopRecruitersAnalytics());
    }

    // Number of applications (APPLIED, INTERVIEWED, HIRED) per recruiter/company
    @GetMapping("/analytics/recruiter-applications")
    public ResponseEntity<Map<String, Map<String, Long>>> getRecruiterApplicationAnalytics() {
        return ResponseEntity.ok(adminService.getRecruiterApplicationAnalytics());
    }

}
