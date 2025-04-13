package com.tnp.tnpbackend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tnp.tnpbackend.service.AppUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "student")
public class Student implements AppUser{

    @Id
    private String studentId;
    private String studentName;
    private String username;
    private String password;
    private String email;
    private double cgpa;
    private String department;
    private List<String> skills;
    private String resumeURL;
    private String profileImageURL; 
    private String academicYear;
    private int backlogs;
    private String graduationYear;
    private String contactNumber;
    private double tenMarks;
    private double higherSecondaryMarks;
    private String studentType;
    private List<String> shortlistedFor = new ArrayList<>(); // List of recruiterIds
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive = true;
    private String role;
    private boolean emailVerified = false;

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getRole() {
        return this.role;
    }

    
}
