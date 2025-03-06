package com.tnp.tnpbackend.model;

import java.time.LocalDate;

public class Admin {

    private int adminId;
    private String adminName;
    private String username;
    private String adminPassword;
    private String role;
    private String phoneNumber;
    private boolean isActive;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    public Admin() {
    }

    public Admin(int adminId, String adminName, String adminEmail, String adminPassword, String role,
            String phoneNumber, boolean isActive,LocalDate createdAt,LocalDate updatedAt) {
        this.adminId = adminId;
        this.adminName = adminName;
        this.username = adminEmail;
        this.adminPassword = adminPassword;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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
        return "Admin [adminId=" + adminId + ", adminName=" + adminName + ", adminEmail=" + username
                + ", adminPassword=" + adminPassword + ", role=" + role + ", phoneNumber=" + phoneNumber + ", isActive="
                + isActive + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }

  

}
