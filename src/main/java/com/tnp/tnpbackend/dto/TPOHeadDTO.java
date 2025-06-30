package com.tnp.tnpbackend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TPOHeadDTO {
    private String id;
    private String username;
    private String password;
    private String email;
    private String contactNumber;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private boolean isActive;
}
