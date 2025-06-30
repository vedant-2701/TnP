package com.tnp.tnpbackend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterDTO {
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
    private List<String> eligibleStudentIds = new ArrayList<>();
    private boolean isNotified = false;
    private String industryType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
