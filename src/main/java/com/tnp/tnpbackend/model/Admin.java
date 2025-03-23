package com.tnp.tnpbackend.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.tnp.tnpbackend.service.AppUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "admin")
public class Admin implements AppUser{

    @Id
    private String adminId;
    private String adminName;
    private String username;
    private String adminPassword;
    private String role;
    private String phoneNumber;
    private boolean isActive;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.adminPassword;
    }
    
    @Override
    public String getRole() {
        return this.role;
    }

}
