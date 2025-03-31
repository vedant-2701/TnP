package com.tnp.tnpbackend.model;

import java.time.LocalDate;
import java.util.Map;

import lombok.Data;

@Data
public class Recruiter {

    private String recruiterId;
    private String companyName;
    private String jobRole;
    private String jobDescription;
    private boolean isActive;
    private LocalDate deadline;
    private String companyLocation;
    private Map<String, String> criteria;
    private String industryType;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    
    


}
