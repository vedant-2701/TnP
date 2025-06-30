package com.tnp.tnpbackend.dto;

import lombok.Data;

@Data
public class StudentSummaryDTO {
    private String studentId;
    private String username;
    private String studentName;
    private String contactNumber;
    private String email;
    private String profileImageURL;
    private boolean emailVerified;
}