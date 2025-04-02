package com.tnp.tnpbackend.dto;

import java.util.List;

import lombok.Data;

@Data
public class AddRecruiterResponse {
    private RecruiterDTO recruiter;
    private List<StudentSummaryDTO> selectedStudents; // Changed to "selectedStudents"
}