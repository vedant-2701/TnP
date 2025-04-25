// package com.tnp.tnpbackend.controller;

// import java.io.IOException;
// import java.util.List;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestPart;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

// import com.tnp.tnpbackend.dto.AddRecruiterResponse;
// import com.tnp.tnpbackend.dto.RecruiterDTO;
// import com.tnp.tnpbackend.dto.StudentDTO;
// import com.tnp.tnpbackend.dto.StudentSummaryDTO;
// import com.tnp.tnpbackend.model.Student;
// import com.tnp.tnpbackend.serviceImpl.AdminServiceImpl;
// import com.tnp.tnpbackend.serviceImpl.RecruiterServiceImpl;
// import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;

// @RestController
// @RequestMapping("/tnp/head")
// public class TnpController {

//     @Autowired
//     private StudentServiceImpl studentService;

//     @Autowired
//     private RecruiterServiceImpl recruiterService;

//     @Autowired
//     private AdminServiceImpl adminService;

//     @GetMapping("/getAllStudents")
//     public ResponseEntity<?> getAllStudents() {
//         List<StudentSummaryDTO> students = studentService.getAllStudents();
//         // System.out.println(students);
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

//      @GetMapping("/getGraduationYears")
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

//     @GetMapping("/get-companies")    
//     public ResponseEntity<?> getAllRecruiters() {
//         List<RecruiterDTO> recruiters = recruiterService.getAllRecruiters();
//         if (recruiters.isEmpty()) {
//             return ResponseEntity.status(404).body("No recruiters found.");
//         }
//         return ResponseEntity.ok(recruiters);
//     }

//     @GetMapping("/getDepartment")
//     public ResponseEntity<?> getDepartment() {
//         List<String> departments = studentService.findDistinctDepartments();
//         return ResponseEntity.ok(departments);
//     }

//     @PostMapping("/job-posting")
//     public ResponseEntity<?> addRecruiter(@RequestBody RecruiterDTO recruiterDTO) {
//         System.out.println(recruiterDTO);
//         try {
//             AddRecruiterResponse response = recruiterService.addRecruiter(recruiterDTO);
//             System.out.println(response);
//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("An error occurred while adding the recruiter: " + e.getMessage());
//         }
//     }

//     @PostMapping(value = "/add-logo", consumes = "multipart/form-data")
//     public ResponseEntity<?> addLogo(@RequestPart(value = "logo", required = false) MultipartFile logo , String companyWebsite) throws IOException  {
//         if (logo == null || logo.isEmpty()) {
//             return ResponseEntity.badRequest().body("Logo file is required.");
//         }
//         RecruiterDTO recruiterDTO = recruiterService.uploadLogo(logo,companyWebsite);
//         return ResponseEntity.ok(recruiterDTO);
//     }

//     @GetMapping("/getCompany/{id}")
//     public ResponseEntity<?> getRecruiter(@PathVariable("id")String id){
//         if (id == null || id.isEmpty()) {
//             return ResponseEntity.badRequest().body("Invalid ID provided.");
//         }
//         RecruiterDTO recruiter = recruiterService.getRecruiterById(id);
//         if (recruiter == null) {
//             return ResponseEntity.status(404).body("Recruiter not found.");
//         }
//         return ResponseEntity.ok(recruiter);
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

//     @GetMapping("/getAppliedStudents/{recruiterId}")
//     public ResponseEntity<?> getAppliedStudents(@PathVariable("recruiterId") String recruiterId) {
//         List<StudentSummaryDTO> students = recruiterService.getAppliedStudents(recruiterId);
//         if (students.isEmpty()) {
//             return ResponseEntity.status(404).body("No students found for the specified recruiter.");
//         }
//         return ResponseEntity.ok(students);
//     }

//     @GetMapping("/getNotappliedStudents/{recruiterId}")
//     public ResponseEntity<?> getNotappliedStudents(@PathVariable("recruiterId") String recruiterId) {
//         List<StudentSummaryDTO> students = recruiterService.getNotappliedStudents(recruiterId);
//         if (students.isEmpty()) {
//             return ResponseEntity.status(404).body("No students found for the specified recruiter.");
//         }
//         return ResponseEntity.ok(students);
//     }
// }


package com.tnp.tnpbackend.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.AddRecruiterResponse;
import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.exception.NoDataFoundException;
import com.tnp.tnpbackend.model.Student;
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

    @GetMapping("/get-companies")    
    public ResponseEntity<?> getAllRecruiters() {
        List<RecruiterDTO> recruiters = recruiterService.getAllRecruiters();
        if (recruiters.isEmpty()) {
            return ResponseEntity.status(404).body("No recruiters found.");
        }
        return ResponseEntity.ok(recruiters);
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

    @PostMapping(value = "/add-logo", consumes = "multipart/form-data")
    public ResponseEntity<?> addLogo(@RequestPart(value = "logo", required = false) MultipartFile logo, String companyWebsite) throws IOException {
        if (logo == null || logo.isEmpty()) {
            return ResponseEntity.badRequest().body("Logo file is required.");
        }
        RecruiterDTO recruiterDTO = recruiterService.uploadLogo(logo, companyWebsite);
        return ResponseEntity.ok(recruiterDTO);
    }

    @PostMapping("/recruiter/{id}/notify")
    public ResponseEntity<?> notifyStudents(@PathVariable("id") String id) {
        try {
            recruiterService.notifyStudentsByRecruiterId(id);
            return ResponseEntity.ok("Email sending initiated for recruiter ID: " + id);
        } catch (NoDataFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error initiating email sending: " + e.getMessage());
        }
    }

    @GetMapping("/getCompany/{id}")
    public ResponseEntity<?> getRecruiter(@PathVariable("id") String id) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid ID provided.");
        }
        RecruiterDTO recruiter = recruiterService.getRecruiterById(id);
        if (recruiter == null) {
            return ResponseEntity.status(404).body("Recruiter not found.");
        }
        return ResponseEntity.ok(recruiter);
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

    @GetMapping("/getAppliedStudents/{recruiterId}")
    public ResponseEntity<?> getAppliedStudents(@PathVariable("recruiterId") String recruiterId) {
        List<StudentSummaryDTO> students = recruiterService.getAppliedStudents(recruiterId);
        if (students.isEmpty()) {
            return ResponseEntity.status(404).body("No students found for the specified recruiter.");
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/getNotappliedStudents/{recruiterId}")
    public ResponseEntity<?> getNotappliedStudents(@PathVariable("recruiterId") String recruiterId) {
        List<StudentSummaryDTO> students = recruiterService.getNotappliedStudents(recruiterId);
        if (students.isEmpty()) {
            return ResponseEntity.status(404).body("No students found for the specified recruiter.");
        }
        return ResponseEntity.ok(students);
    }
}