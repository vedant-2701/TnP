package com.tnp.tnpbackend.repository;

import com.tnp.tnpbackend.model.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OTPRepository extends MongoRepository<OTP, String> {
    Optional<OTP> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
}