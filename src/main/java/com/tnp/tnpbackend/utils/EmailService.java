package com.tnp.tnpbackend.utils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        try {
            mailSender.send(message);
            System.out.println("Email sent successfully");
        } catch (MailException e) {
            System.out.println("Failed to send email");
        }
    }

   @Async("emailTaskExecutor")
    public void sendEmailAsync(String to, String subject, String body) {
        sendEmail(to, subject, body);
    }

    public JavaMailSender getMailSender() {
        return mailSender;
    }
}
