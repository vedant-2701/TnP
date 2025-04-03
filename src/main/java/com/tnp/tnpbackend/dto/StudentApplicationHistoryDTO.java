package com.tnp.tnpbackend.dto;

import lombok.Data;

@Data
public class StudentApplicationHistoryDTO {
    private String relationId; // ID of the StudentRecruiterRelation
    private String recruiterId;
    private String companyName;
    private String jobRole;
    private String status; // "APPLIED", "INTERVIEWED", "HIRED"
    private String appliedAt; // Could use LocalDateTime, but String for simplicity
}