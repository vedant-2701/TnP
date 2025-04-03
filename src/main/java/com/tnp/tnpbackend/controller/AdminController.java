package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.helper.AdminHelper;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.repository.StudentRecruiterRelationRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.StudentService;
import com.tnp.tnpbackend.serviceImpl.AdminExcelServiceImpl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tnp/admin")
public class AdminController {

    @Autowired
    private AdminHelper adminHelper;

    @Autowired
    private AdminExcelServiceImpl adminExcelServiceImpl;

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRecruiterRelationRepository relationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Admin logged in";
    }

    // for bulk data upload
    @PostMapping("/upload-students")
    public ResponseEntity<?> addStudents(@RequestParam("file") MultipartFile file) {
        System.out.println("Received file: " + file.getOriginalFilename());
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded or file is empty.");
        }
        if (!adminHelper.checkExcelFormat(file)) {
            return ResponseEntity.badRequest().body("Invalid file format. Please upload an Excel file (.xlsx).");
        }
        try {
            List<Student> students = adminHelper.convertExcelToListOfStudents(file.getInputStream());
            if (students.isEmpty()) {
                return ResponseEntity.ok("No valid student data found in the file.");
            }
            adminExcelServiceImpl.save(students);
            return ResponseEntity.ok("Successfully uploaded " + students.size() + " students.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error saving students: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    // for single student data upload
    @PostMapping(value = "/upload-student", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    public ResponseEntity<?> addStudent(@RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("graduationYear") String graduationYear, @RequestParam("department") String department) {
        try {
            StudentDTO studentDTO = new StudentDTO();
            studentDTO.setUsername(username);
            studentDTO.setPassword(password);
            studentDTO.setGraduationYear(graduationYear);
            studentDTO.setDepartment(department);
            System.out.println(studentDTO);
            StudentDTO savedStudentDTO = studentService.addStudent(studentDTO);
            return ResponseEntity.ok(savedStudentDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    // for getting all students with specific fields
    @GetMapping("/getAllStudents")
    public ResponseEntity<?> getAllStudents() {
        List<StudentSummaryDTO> students = studentService.getAllStudents();
        System.out.println(students);
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

    @GetMapping("/getStudentByDepartmentAndId/{department}/{id}")
    public ResponseEntity<?> getStudentByDepartmentAndId(
            @PathVariable("department") String department,
            @PathVariable("id") String id) {
        try {
            StudentDTO student = studentService.getStudentByDepartmentAndId(department, id);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // analytics code

    // pie chart - status wise applied, interviewed, hired
    @GetMapping("/analytics/application-status")
    public ResponseEntity<Map<String, Long>> getApplicationStatusAnalytics() {
        List<StudentRecruiterRelation> relations = relationRepository.findAll();
        Map<String, Long> statusCounts = new HashMap<>();

        statusCounts.put("APPLIED", relations.stream().filter(r -> "APPLIED".equals(r.getStatus())).count());
        statusCounts.put("INTERVIEWED", relations.stream().filter(r -> "INTERVIEWED".equals(r.getStatus())).count());
        statusCounts.put("HIRED", relations.stream().filter(r -> "HIRED".equals(r.getStatus())).count());

        return ResponseEntity.ok(statusCounts);
    }

    // bar chart - number of students per department
    @GetMapping("/analytics/students-by-department")
    public ResponseEntity<Map<String, Long>> getStudentsByDepartmentAnalytics() {
        List<String> departments = studentService.findDistinctDepartments();
        Map<String, Long> departmentCounts = new HashMap<>();

        for (String dept : departments) {
            long count = studentRepository.findByDepartment(dept).size();
            departmentCounts.put(dept, count);
        }

        return ResponseEntity.ok(departmentCounts);
    }

    // Placement Success Rate by Department
    @GetMapping("/analytics/placement-success-rate")
    public ResponseEntity<Map<String, Double>> getPlacementSuccessRateAnalytics() {
        List<String> departments = studentService.findDistinctDepartments();
        Map<String, Double> successRates = new HashMap<>();

        for (String dept : departments) {
            List<Student> deptStudents = studentRepository.findByDepartment(dept);
            long totalStudents = deptStudents.size();
            if (totalStudents == 0)
                continue;

            long hiredCount = relationRepository.findAll().stream()
                    .filter(r -> "HIRED".equals(r.getStatus()) && dept.equals(r.getStudent().getDepartment()))
                    .count();

            double successRate = (double) hiredCount / totalStudents * 100;
            successRates.put(dept, Math.round(successRate * 100.0) / 100.0); // Round to 2 decimals
        }

        return ResponseEntity.ok(successRates);
    }

    // This endpoint lists the top recruiters based on the number of students hired,
    // useful for identifying the most active companies.
    @GetMapping("/analytics/top-recruiters")
    public ResponseEntity<List<Map<String, Object>>> getTopRecruitersAnalytics() {
        Map<Recruiter, Long> hireCounts = relationRepository.findAll().stream()
                .filter(r -> "HIRED".equals(r.getStatus()))
                .collect(Collectors.groupingBy(StudentRecruiterRelation::getRecruiter, Collectors.counting()));

        List<Map<String, Object>> topRecruiters = hireCounts.entrySet().stream()
                .sorted(Map.Entry.<Recruiter, Long>comparingByValue().reversed())
                .limit(5) // Top 5 recruiters
                .map(entry -> {
                    Map<String, Object> recruiterData = new HashMap<>();
                    recruiterData.put("companyName", entry.getKey().getCompanyName());
                    recruiterData.put("hiredCount", entry.getValue());
                    return recruiterData;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(topRecruiters);
    }

    // This endpoint provides the number of applications (APPLIED, INTERVIEWED,
    // HIRED) per recruiter/company.
    @GetMapping("/analytics/recruiter-applications")
    public ResponseEntity<Map<String, Map<String, Long>>> getRecruiterApplicationAnalytics() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        Map<String, Map<String, Long>> recruiterStats = new HashMap<>();

        for (Recruiter recruiter : recruiters) {
            List<StudentRecruiterRelation> relations = relationRepository.findByRecruiter(recruiter);
            Map<String, Long> statusCounts = new HashMap<>();

            statusCounts.put("APPLIED", relations.stream().filter(r -> "APPLIED".equals(r.getStatus())).count());
            statusCounts.put("INTERVIEWED",
                    relations.stream().filter(r -> "INTERVIEWED".equals(r.getStatus())).count());
            statusCounts.put("HIRED", relations.stream().filter(r -> "HIRED".equals(r.getStatus())).count());

            recruiterStats.put(recruiter.getCompanyName(), statusCounts);
        }

        return ResponseEntity.ok(recruiterStats);
    }

}
