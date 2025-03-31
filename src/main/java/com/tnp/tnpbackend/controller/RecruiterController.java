package com.tnp.tnpbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnp.tnpbackend.dto.RecruiterDTO;

@RestController
@RequestMapping("/tnp/recruiter")
public class RecruiterController {

    public ResponseEntity<?> addCompany(@RequestBody RecruiterDTO recruiterDTO){
        
        return null;
    }
}
