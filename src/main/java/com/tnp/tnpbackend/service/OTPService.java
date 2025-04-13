package com.tnp.tnpbackend.service;

public interface OTPService {
    void generateAndSendOTP(String email);
    boolean verifyOTP(String email, String otp);
}