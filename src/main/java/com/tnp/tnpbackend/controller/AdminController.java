package com.tnp.tnpbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.tnp.tnpbackend.helper.AdminHelper;
import com.tnp.tnpbackend.model.Student;
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

    @GetMapping("/dashboard")
    public String adminDashboard() {
        return "Admin logged in";
    }

    @PostMapping("/upload-students")
    public ResponseEntity<String> addStudents(@RequestParam("file") MultipartFile file) {
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
}