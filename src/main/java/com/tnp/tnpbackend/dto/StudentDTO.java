package com.tnp.tnpbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {


    private String studentId;
    private String studentName;
    private String username;
    @JsonIgnore
    private String password;
    private String email;
    private double cgpa;
    private String department;
    private List<String> skills;
    private String resumeURL;
    private String profileImageURL; // New field
    private String academicYear;
    private int backlogs;
    private String graduationYear;
    private String contactNumber;
    private LocalDateTime createdAt;
    private double tenMarks;
    private double higherSecondaryMarks;
    private String studentType;
    private LocalDateTime updatedAt;
    private String role;
    
}
