package com.tnp.tnpbackend.model;

import java.time.LocalDate;

public class TPOHead {

    private int id;
    private String username;
    private String password; 
    private String email;
    private String contactNumber; 
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean isActive;
    
    public TPOHead() {
    }
    public TPOHead(int id, String username, String password, String email, String contactNumber, LocalDate createdAt,
            LocalDate updatedAt, boolean isActive) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.contactNumber = contactNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getContactNumber() {
        return contactNumber;
    }
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
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
    public boolean isActive() {
        return isActive;
    }
    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
    @Override
    public String toString() {
        return "TPOHead [id=" + id + ", username=" + username + ", password=" + password + ", email=" + email
                + ", contactNumber=" + contactNumber + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
                + ", isActive=" + isActive + "]";
    }
    
    
    
}
