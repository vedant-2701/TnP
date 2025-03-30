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
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.service.StudentService;
import com.tnp.tnpbackend.serviceImpl.AdminExcelServiceImpl;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/tnp/admin")
public class AdminController {

    @Autowired
    private AdminHelper adminHelper;

    @Autowired
    private AdminExcelServiceImpl adminExcelServiceImpl;

    @Autowired
    private StudentService studentService;

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Admin logged in";
    }

    //for bulk data upload
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

    //for single student data upload
    @PostMapping(value = "/upload-student", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    public ResponseEntity<?> addStudent(@RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("graduationYear") String graduationYear, @RequestParam("department") String department) {
        try{
            StudentDTO studentDTO = new StudentDTO();
        studentDTO.setUserName(username);
        studentDTO.setPassword(password);
        studentDTO.setGraduationYear(graduationYear);
        studentDTO.setDepartment(department);
        System.out.println(studentDTO);
        StudentDTO savedStudentDTO = studentService.addStudent(studentDTO);
        return ResponseEntity.ok(savedStudentDTO);
        }
        catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        }
        catch(Exception e){
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    //for getting all students with specific fields
    @GetMapping("/getAllStudents")
    public ResponseEntity<?> getAllStudents() {
        List<StudentSummaryDTO> students = studentService.getAllStudents();
        System.out.println(students);
        if(students.isEmpty() || students == null){
            return ResponseEntity.status(404).body("No students found.");
        }
        return ResponseEntity.ok(students);
    }

    //for getting student by id
    @GetMapping("/getStudent/{id}")
    public ResponseEntity<?> getStudent(@PathVariable("id") String id){
        if(id == null || id.isEmpty()){
            return ResponseEntity.badRequest().body("Invalid ID provided.");
        }
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    //for getting students by department
    @GetMapping("/getStudentsByDepartment/{department}")
    public ResponseEntity<?> getStudentsByDepartment(@PathVariable("department") String department) {
        List<StudentSummaryDTO> students = studentService.getStudentsByDepartment(department);
        if (students.isEmpty()) {
            return ResponseEntity.status(404).body("No students found in the specified department.");
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/getDepartment")
    public ResponseEntity<?> getDepartment(){
        List<String>departments = studentService.findDistinctDepartments();
        return ResponseEntity.ok(departments);
    }
}