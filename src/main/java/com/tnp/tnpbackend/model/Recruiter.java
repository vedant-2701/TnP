package com.tnp.tnpbackend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "recruiter")
public class Recruiter {
    @Id
    private String recruiterId;
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String companyDescription;
    private String jobRole;
    private String jobDescription;
    //private boolean isActive;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;
    private String companyLocation;
    private Map<String, String> criteria;
    private List<String> eligibleStudentIds = new ArrayList<>();
    private boolean isNotified = false;
    private String industryType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
