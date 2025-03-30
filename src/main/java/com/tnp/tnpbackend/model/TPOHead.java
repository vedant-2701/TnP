package com.tnp.tnpbackend.model;

import java.time.LocalDate;

import org.springframework.data.mongodb.core.mapping.Document;

import com.tnp.tnpbackend.service.AppUser;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tpoHead")
public class TPOHead implements AppUser{

    private String id;
    private String username;
    private String password; 
    private String email;
    private String contactNumber; 
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean isActive;
    private String role;
    
    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getRole() {
        return this.role;
    }
    

}
