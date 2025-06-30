package com.tnp.tnpbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "otps")
public class OTP {
    @Id
    private String id;
    private String email;
    private String otp;
    private LocalDateTime createdAt;
    @Indexed(expireAfterSeconds = 300) // 5 minutes TTL
    private LocalDateTime expiresAt;
}