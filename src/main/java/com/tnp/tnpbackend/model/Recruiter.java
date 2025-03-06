package com.tnp.tnpbackend.model;

import java.time.LocalDate;
import java.util.Map;

public class Recruiter {

    private int recruiterId;
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

    
    
    public Recruiter() {
    }
    public Recruiter(int recruiterId, String companyName, String jobRole, String jobDescription, boolean isActive,
            LocalDate deadline, String companyLocation, Map<String, String> criteria, String industryType,
            LocalDate createdAt, LocalDate updatedAt) {
        this.recruiterId = recruiterId;
        this.companyName = companyName;
        this.jobRole = jobRole;
        this.jobDescription = jobDescription;
        this.isActive = isActive;
        this.deadline = deadline;
        this.companyLocation = companyLocation;
        this.criteria = criteria;
        this.industryType = industryType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    public int getRecruiterId() {
        return recruiterId;
    }
    public void setRecruiterId(int recruiterId) {
        this.recruiterId = recruiterId;
    }
    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public String getJobRole() {
        return jobRole;
    }
    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }
    public String getJobDescription() {
        return jobDescription;
    }
    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
    public boolean isActive() {
        return isActive;
    }
    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
    public LocalDate getDeadline() {
        return deadline;
    }
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
    public String getCompanyLocation() {
        return companyLocation;
    }
    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }
    public Map<String, String> getCriteria() {
        return criteria;
    }
    public void setCriteria(Map<String, String> criteria) {
        this.criteria = criteria;
    }
    public String getIndustryType() {
        return industryType;
    }
    public void setIndustryType(String industryType) {
        this.industryType = industryType;
    }
    public LocalDate getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDate getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
    @Override
    public String toString() {
        return "Recruiter [recruiterId=" + recruiterId + ", companyName=" + companyName + ", jobRole=" + jobRole
                + ", jobDescription=" + jobDescription + ", isActive=" + isActive + ", deadline=" + deadline
                + ", companyLocation=" + companyLocation + ", criteria=" + criteria + ", industryType=" + industryType
                + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }

    



    



}
