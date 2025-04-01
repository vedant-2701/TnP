package com.tnp.tnpbackend.service;

import java.util.List;

import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.model.Recruiter;

public interface RecruiterService {

    public RecruiterDTO addRecruiter(RecruiterDTO recruiterDTO);
    public List<Recruiter> getAllRecruiters();
}
