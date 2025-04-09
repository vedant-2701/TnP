// package com.tnp.tnpbackend.controller;

// import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

// import com.tnp.tnpbackend.dto.DeactivationRequestDTO;
// import com.tnp.tnpbackend.dto.StudentDTO;
// import com.tnp.tnpbackend.dto.StudentSummaryDTO;
// import com.tnp.tnpbackend.helper.AdminHelper;
// import com.tnp.tnpbackend.model.Student;
// import com.tnp.tnpbackend.serviceImpl.AdminExcelServiceImpl;
// import com.tnp.tnpbackend.serviceImpl.AdminServiceImpl;

// import java.io.IOException;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/tnp/admin")
// public class AdminController {

//     @Autowired
//     private AdminHelper adminHelper;

//     @Autowired
//     private AdminExcelServiceImpl adminExcelServiceImpl;

//     @Autowired
//     private StudentServiceImpl studentService;

//     @Autowired
//     private AdminServiceImpl adminService;

//     AdminController(StudentServiceImpl studentServiceImpl) {
//     }

//     @GetMapping("/dashboard")
//     public String adminDashboard() {
//         return "Admin logged in";
//     }

//     // for bulk data upload
//     @PostMapping("/upload-students")
//     public ResponseEntity<?> addStudents(@RequestParam("file") MultipartFile file) {
//         System.out.println("Received file: " + file.getOriginalFilename());
//         if (file.isEmpty()) {
//             return ResponseEntity.badRequest().body("No file uploaded or file is empty.");
//         }
//         if (!adminHelper.checkExcelFormat(file)) {
//             return ResponseEntity.badRequest().body("Invalid file format. Please upload an Excel file (.xlsx).");
//         }
//         try {
//             List<Student> students = adminHelper.convertExcelToListOfStudents(file.getInputStream());
//             if (students.isEmpty()) {
//                 return ResponseEntity.ok("No valid student data found in the file.");
//             }
//             adminExcelServiceImpl.save(students);
//             return ResponseEntity.ok("Successfully uploaded " + students.size() + " students.");
//         } catch (IOException e) {
//             return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(500).body("Error saving students: " + e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
//         }
//     }

//     // for single student data upload
//     @PostMapping(value = "/upload-student", consumes = "application/x-www-form-urlencoded", produces = "application/json")
//     public ResponseEntity<?> addStudent(@RequestParam("username") String username,
//             @RequestParam("password") String password,
//             @RequestParam("graduationYear") String graduationYear, @RequestParam("department") String department) {
//         try {
//             StudentDTO studentDTO = new StudentDTO();
//             studentDTO.setUsername(username);
//             studentDTO.setPassword(password);
//             studentDTO.setGraduationYear(graduationYear);
//             studentDTO.setDepartment(department);
//             System.out.println(studentDTO);
//             StudentDTO savedStudentDTO = studentService.addStudent(studentDTO);
//             return ResponseEntity.ok(savedStudentDTO);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
//         }
//     }

//     // for getting all students with specific fields
//     @GetMapping("/getAllStudents")
//     public ResponseEntity<?> getAllStudents() {
//         List<StudentSummaryDTO> students = studentService.getAllStudents();
//         System.out.println(students);
//         if (students.isEmpty() || students == null) {
//             return ResponseEntity.status(404).body("No students found.");
//         }
//         return ResponseEntity.ok(students);
//     }

//     // for getting student by id
//     @GetMapping("/getStudent/{id}")
//     public ResponseEntity<?> getStudent(@PathVariable("id") String id) {
//         if (id == null || id.isEmpty()) {
//             return ResponseEntity.badRequest().body("Invalid ID provided.");
//         }
//         StudentDTO student = studentService.getStudentById(id);
//         return ResponseEntity.ok(student);
//     }

//     // for getting students by department
//     @GetMapping("/getStudentsByDepartment/{department}")
//     public ResponseEntity<?> getStudentsByDepartment(@PathVariable("department") String department) {
//         List<StudentSummaryDTO> students = studentService.getStudentsByDepartment(department);
//         if (students.isEmpty()) {
//             return ResponseEntity.status(404).body("No students found in the specified department.");
//         }
//         return ResponseEntity.ok(students);
//     }

//     @GetMapping("/getDepartment")
//     public ResponseEntity<?> getDepartment() {
//         List<String> departments = studentService.findDistinctDepartments();
//         return ResponseEntity.ok(departments);
//     }

//     @GetMapping("/getGraduationYears")
//     public ResponseEntity<?> getGraduationYears() {
//         List<String> graduationYears = studentService.findGraduationYears();
//         return ResponseEntity.ok(graduationYears);
//     }

//     @GetMapping("/getStudentByGraduationYear/{year}")
//     public ResponseEntity<?> getStudentByGraduationYear(
//             @PathVariable("year") String year) {
//         try {
//             List<Student> students = studentService.getStudentByGraduationYear(year);
//             return ResponseEntity.ok(students);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(404).body(e.getMessage());
//         }
//     }

//     @GetMapping("/getStudentByDepartmentAndId/{department}/{id}")
//     public ResponseEntity<?> getStudentByDepartmentAndId(
//             @PathVariable("department") String department,
//             @PathVariable("id") String id) {
//         try {
//             StudentDTO student = studentService.getStudentByDepartmentAndId(department, id);
//             return ResponseEntity.ok(student);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(404).body(e.getMessage());
//         }
//     }

//     // analytics code

//     // Pie chart - status wise applied, interviewed, hired
//     @GetMapping("/analytics/application-status")
//     public ResponseEntity<Map<String, Long>> getApplicationStatusAnalytics() {
//         return ResponseEntity.ok(adminService.getApplicationStatusAnalytics());
//     }

//     // Bar chart - number of students per department
//     @GetMapping("/analytics/students-by-department")
//     public ResponseEntity<Map<String, Long>> getStudentsByDepartmentAnalytics() {
//         return ResponseEntity.ok(adminService.getStudentsByDepartmentAnalytics());
//     }

//     // Placement Success Rate by Department
//     @GetMapping("/analytics/placement-success-rate")
//     public ResponseEntity<Map<String, Double>> getPlacementSuccessRateAnalytics() {
//         return ResponseEntity.ok(adminService.getPlacementSuccessRateAnalytics());
//     }

//     // Top recruiters based on number of students hired
//     @GetMapping("/analytics/top-recruiters")
//     public ResponseEntity<List<Map<String, Object>>> getTopRecruitersAnalytics() {
//         return ResponseEntity.ok(adminService.getTopRecruitersAnalytics());
//     }

//     // Number of applications (APPLIED, INTERVIEWED, HIRED) per recruiter/company
//     @GetMapping("/analytics/recruiter-applications")
//     public ResponseEntity<Map<String, Map<String, Long>>> getRecruiterApplicationAnalytics() {
//         return ResponseEntity.ok(adminService.getRecruiterApplicationAnalytics());
//     }

//     @PostMapping("/deactivate-warning")
//     public ResponseEntity<String> sendDeactivationWarning(@RequestBody DeactivationRequestDTO request) {
//         try {
//             if (request.getUsername() == null || request.getUsername().isEmpty()) {
//                 return ResponseEntity.badRequest().body("Username is required");
//             }
//             adminService.sendDeactivationWarning(request.getUsername(), request.getReason(), request.isNotifyUser());
//             return ResponseEntity.ok("Deactivation warning sent to " + request.getUsername());
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("Error sending deactivation warning: " + e.getMessage());
//         }
//     }

//     @PostMapping("/deactivate")
//     public ResponseEntity<String> deactivateUser(@RequestBody DeactivationRequestDTO request) {
//         try {
//             if (request.getUsername() == null || request.getUsername().isEmpty()) {
//                 return ResponseEntity.badRequest().body("Username is required");
//             }
//             adminService.deactivateUser(request.getUsername());
//             return ResponseEntity.ok("User " + request.getUsername() + " deactivated successfully");
//         } catch (Exception e) {
//             return ResponseEntity.status(403).body("Account is Deactivated or not found: " + e.getMessage());
//         }
//     }

//     @PostMapping("/deactivate-all")
//     public ResponseEntity<?> deactivateAll(@RequestBody List<DeactivationRequestDTO> requests) {
//         if (requests == null || requests.isEmpty()) {
//             return ResponseEntity.badRequest().body("At least one username is required");
//         }

//         List<String> successfulDeactivations = new ArrayList<>();
//         Map<String, String> failedDeactivations = new HashMap<>();

//         for (DeactivationRequestDTO request : requests) {
//             try {
//                 if (request.getUsername() == null || request.getUsername().isEmpty()) {
//                     failedDeactivations.put("unknown", "Username is required");
//                     continue;
//                 }

//                 adminService.deactivateUser(request.getUsername());
//                 successfulDeactivations.add(request.getUsername());

//             } catch (Exception e) {
//                 failedDeactivations.put(request.getUsername(), e.getMessage());
//             }
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("successfulDeactivations", successfulDeactivations);
//         response.put("failedDeactivations", failedDeactivations);

//         if (failedDeactivations.isEmpty()) {
//             return ResponseEntity.ok(response);
//         } else if (successfulDeactivations.isEmpty()) {
//             return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
//         } else {
//             return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
//         }
//     }

// }









package com.tnp.tnpbackend.controller;

import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.DeactivationRequestDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.helper.AdminHelper;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.RedisService;
import com.tnp.tnpbackend.serviceImpl.AdminExcelServiceImpl;
import com.tnp.tnpbackend.serviceImpl.AdminServiceImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tnp/admin")
public class AdminController {

    @Autowired
    private AdminHelper adminHelper;

    @Autowired
    private AdminExcelServiceImpl adminExcelServiceImpl;

    @Autowired
    private StudentServiceImpl studentService;

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private RedisService redisService;

    AdminController(StudentServiceImpl studentServiceImpl) {
    }

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Admin logged in";
    }

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
            redisService.set("students:all", null, 0L); // Invalidate cache
            return ResponseEntity.ok("Successfully uploaded " + students.size() + " students.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error saving students: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

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

    @GetMapping("/getAllStudents")
    public ResponseEntity<?> getAllStudents() {
        List<StudentSummaryDTO> students = studentService.getAllStudents();
        System.out.println(students);
        if (students.isEmpty() || students == null) {
            return ResponseEntity.status(404).body("No students found.");
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/getStudent/{id}")
    public ResponseEntity<?> getStudent(@PathVariable("id") String id) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid ID provided.");
        }
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

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

    @GetMapping("/getGraduationYears")
    public ResponseEntity<?> getGraduationYears() {
        List<String> graduationYears = studentService.findGraduationYears();
        return ResponseEntity.ok(graduationYears);
    }

    @GetMapping("/getStudentByGraduationYear/{year}")
    public ResponseEntity<?> getStudentByGraduationYear(
            @PathVariable("year") String year) {
        try {
            List<Student> students = studentService.getStudentByGraduationYear(year);
            return ResponseEntity.ok(students);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
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

    @GetMapping("/analytics/application-status")
    public ResponseEntity<Map<String, Long>> getApplicationStatusAnalytics() {
        return ResponseEntity.ok(adminService.getApplicationStatusAnalytics());
    }

    @GetMapping("/analytics/students-by-department")
    public ResponseEntity<Map<String, Long>> getStudentsByDepartmentAnalytics() {
        return ResponseEntity.ok(adminService.getStudentsByDepartmentAnalytics());
    }

    @GetMapping("/analytics/placement-success-rate")
    public ResponseEntity<Map<String, Double>> getPlacementSuccessRateAnalytics() {
        return ResponseEntity.ok(adminService.getPlacementSuccessRateAnalytics());
    }

    @GetMapping("/analytics/top-recruiters")
    public ResponseEntity<List<Map<String, Object>>> getTopRecruitersAnalytics() {
        return ResponseEntity.ok(adminService.getTopRecruitersAnalytics());
    }

    @GetMapping("/analytics/recruiter-applications")
    public ResponseEntity<Map<String, Map<String, Long>>> getRecruiterApplicationAnalytics() {
        return ResponseEntity.ok(adminService.getRecruiterApplicationAnalytics());
    }

    @PostMapping("/deactivate-warning")
    public ResponseEntity<String> sendDeactivationWarning(@RequestBody DeactivationRequestDTO request) {
        try {
            if (request.getUsername() == null || request.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            adminService.sendDeactivationWarning(request.getUsername(), request.getReason(), request.isNotifyUser());
            return ResponseEntity.ok("Deactivation warning sent to " + request.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending deactivation warning: " + e.getMessage());
        }
    }

    @PostMapping("/deactivate")
    public ResponseEntity<String> deactivateUser(@RequestBody DeactivationRequestDTO request) {
        try {
            if (request.getUsername() == null || request.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            adminService.deactivateUser(request.getUsername());
            return ResponseEntity.ok("User " + request.getUsername() + " deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Account is Deactivated or not found: " + e.getMessage());
        }
    }

    @PostMapping("/deactivate-all")
    public ResponseEntity<?> deactivateAll(@RequestBody List<DeactivationRequestDTO> requests) {
        if (requests == null || requests.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one username is required");
        }

        List<String> successfulDeactivations = new ArrayList<>();
        Map<String, String> failedDeactivations = new HashMap<>();

        for (DeactivationRequestDTO request : requests) {
            try {
                if (request.getUsername() == null || request.getUsername().isEmpty()) {
                    failedDeactivations.put("unknown", "Username is required");
                    continue;
                }
                adminService.deactivateUser(request.getUsername());
                successfulDeactivations.add(request.getUsername());
            } catch (Exception e) {
                failedDeactivations.put(request.getUsername(), e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("successfulDeactivations", successfulDeactivations);
        response.put("failedDeactivations", failedDeactivations);

        if (!successfulDeactivations.isEmpty()) {
            redisService.set("students:all", null, 0L); // Invalidate all students cache
        }

        if (failedDeactivations.isEmpty()) {
            return ResponseEntity.ok(response);
        } else if (successfulDeactivations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
        }
    }
}