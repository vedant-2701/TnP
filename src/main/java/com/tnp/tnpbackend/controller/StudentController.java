package com.tnp.tnpbackend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tnp.tnpbackend.dto.ApplicationRequest;
import com.tnp.tnpbackend.dto.StudentApplicationHistoryDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.exception.InvalidInputException;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.PlacementService;
import com.tnp.tnpbackend.service.RecruiterService;
import com.tnp.tnpbackend.serviceImpl.StudentServiceImpl;

@RestController
@RequestMapping("/tnp/student")
public class StudentController {

    @Autowired
    private StudentServiceImpl studentService;

    @Autowired
    private PlacementService placementService;

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/addStudent")
    public ResponseEntity<StudentDTO> addStudent(@RequestBody StudentDTO studentDTO) {
        StudentDTO savedStudentDTO = studentService.addStudent(studentDTO);
        return ResponseEntity.ok(savedStudentDTO);
    }

    @GetMapping("/dashboard")
    public String studentDashboard() {
        return "Student logged in";
    }

    // @GetMapping("/getStudent/{id}")
    // public ResponseEntity<StudentDTO> getStudent(@PathVariable("id") String id) {
    //     if (id == null || id.isEmpty()) {
    //         return ResponseEntity.badRequest().body(null);
    //     }
    //     StudentDTO student = studentService.getStudentById(id);
    //     return ResponseEntity.ok(student);
    // }
    
    @GetMapping("/getStudent/{username}")
    public ResponseEntity<StudentDTO> getStudentByUsername(@PathVariable("username") String username) {
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        StudentDTO student = studentService.getStudentByUsername(username);
        return ResponseEntity.ok(student);
    }
    @PatchMapping("/update-profile")
    public ResponseEntity<StudentDTO> updateProfile(@RequestBody StudentDTO studentDTO) {
        System.out.println(studentDTO);
        StudentDTO updatedStudentDTO = studentService.updateProfile(studentDTO);
        System.out.println(updatedStudentDTO);
        return ResponseEntity.ok(updatedStudentDTO);
    }

    @PostMapping("/upload-profile-pic")
    public ResponseEntity<StudentDTO> uploadProfilePic(
            @RequestPart(value = "profileImage", required = true) MultipartFile profileImage) throws IOException {
        StudentDTO updatedStudentDTO = studentService.updateProfilePicture(profileImage);
        return ResponseEntity.ok(updatedStudentDTO);
    }

    // @PostMapping(value = "/update-profile-complete", consumes = "multipart/form-data")
    // public ResponseEntity<StudentDTO> updateProfileComplete(
    //         @RequestPart(value = "studentDTO", required = false) StudentDTO studentDTO,
    //         @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {
    //     StudentDTO updatedStudentDTO = studentService.updateProfileComplete(studentDTO, profileImage);
    //     return ResponseEntity.ok(updatedStudentDTO);
    // }

    @PostMapping(value = "/update-profile-complete", consumes = "multipart/form-data")
    public ResponseEntity<StudentDTO> updateProfileComplete(
            @RequestPart(value = "studentDTO", required = false) String studentDTOJson,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {
        StudentDTO studentDTO = null;
        if (studentDTOJson != null && !studentDTOJson.isEmpty()) {
            studentDTO = objectMapper.readValue(studentDTOJson, StudentDTO.class);
        }
        if ((studentDTO == null || studentDTO.getUsername() == null || studentDTO.getUsername().isBlank()) &&
                (profileImage == null || profileImage.isEmpty())) {
            throw new InvalidInputException("At least one of profile data or profile image must be provided");
        }
        StudentDTO updatedStudentDTO = studentService.updateProfileComplete(studentDTO, profileImage);
        System.out.println(updatedStudentDTO);
        return ResponseEntity.ok(updatedStudentDTO);
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

    @GetMapping("/my-history/{studentId}")
    public ResponseEntity<List<StudentApplicationHistoryDTO>> getMyHistory(@PathVariable String studentId) {
        List<StudentApplicationHistoryDTO> history = studentService.getMyHistory(studentId);
        if (history.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(history);
    }

    @PostMapping("/update-status/{relationId}/{status}")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable String relationId,
            @PathVariable String status) {
        studentService.updateApplicationStatus(relationId, status);
        return ResponseEntity.ok("Status updated to " + status);
    }

    @GetMapping("/Appplied/{studentId}")
    public ResponseEntity<List<StudentApplicationHistoryDTO>> getAppliedJobs(@PathVariable String studentId) {
        List<StudentApplicationHistoryDTO> appliedJobs = studentService.getAppliedJobs(studentId);
        if (appliedJobs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(appliedJobs);
    }

    @GetMapping("/NotApplied/{studentId}")
    public ResponseEntity<List<StudentApplicationHistoryDTO>> getNotAppliedJobs(@PathVariable String studentId) {
        List<StudentApplicationHistoryDTO> notAppliedJobs = studentService.getNotAppliedJobs(studentId);
        if (notAppliedJobs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(notAppliedJobs);
    }
}