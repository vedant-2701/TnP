package com.tnp.tnpbackend.serviceImpl;

import com.tnp.tnpbackend.exception.InvalidInputException;
import com.tnp.tnpbackend.model.OTP;
import com.tnp.tnpbackend.repository.OTPRepository;
import com.tnp.tnpbackend.service.OTPService;
import com.tnp.tnpbackend.utils.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPServiceImpl implements OTPService {

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private EmailService emailService;


    private static final int OTP_LENGTH = 6;
    private static final int EXPIRATION_MINUTES = 5;

    @Override
    public void generateAndSendOTP(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidInputException("Email cannot be null or empty");
        }
        // Generate random OTP
        String otp = generateRandomOTP();
        // Store OTP in MongoDB
        OTP otpEntity = new OTP();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setCreatedAt(LocalDateTime.now());
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);
        otpRepository.save(otpEntity);

        // Send OTP via email
        String subject = "Email Verification OTP";
        String body = String.format("Dear User,\n\nYour OTP for email verification is: %s\nThis OTP is valid for %d minutes.\n\nRegards,\nTNP Team", otp, EXPIRATION_MINUTES);
        emailService.sendEmail(email, subject, body);
    }

    @Override
    public boolean verifyOTP(String email, String otp) {
        if (email == null || otp == null || email.isBlank() || otp.isBlank()) {
            return false;
        }
        Optional<OTP> otpEntityOpt = otpRepository.findByEmailAndOtp(email, otp);
        if (otpEntityOpt.isEmpty()) {
            return false;
        }
        OTP otpEntity = otpEntityOpt.get();
        if (otpEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRepository.delete(otpEntity);
            return false;
        }

        // OTP is valid, clean up
        otpRepository.delete(otpEntity);
        return true;
    }

    private String generateRandomOTP() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}