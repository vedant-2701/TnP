package com.tnp.tnpbackend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import lombok.Data;

@Data
public class StudentApplicationHistoryDTO {
    private String relationId; // ID of the StudentRecruiterRelation
    private String recruiterId;
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String companyDescription;
    private String jobRole;
    private String jobDescription;
    private LocalDate deadline;
    private String companyLocation;
    private Map<String, String> criteria;
    private boolean isNotified = false;
    private String industryType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // "APPLIED", "INTERVIEWED", "HIRED"
    private String appliedAt; // Could use LocalDateTime, but String for simplicity
}