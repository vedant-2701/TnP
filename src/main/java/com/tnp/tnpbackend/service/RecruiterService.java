package com.tnp.tnpbackend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.AddRecruiterResponse;
import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.model.Recruiter;

public interface RecruiterService {

    public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO,MultipartFile profileImage) throws IOException;
    public List<Recruiter> getAllRecruiters();
}
