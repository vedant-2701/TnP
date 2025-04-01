package com.tnp.tnpbackend.dto;

import java.time.LocalDate;
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
