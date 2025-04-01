package com.tnp.tnpbackend.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.service.RecruiterService;
import com.tnp.tnpbackend.utils.DTOMapper;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private DTOMapper dtoMapper;

    public RecruiterDTO addRecruiter(RecruiterDTO recruiterDTO) {
        if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
            throw new IllegalArgumentException("Company name cannot be empty");
        }
        if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
            throw new IllegalArgumentException("Job role cannot be empty");
        }

        Recruiter recruiter = dtoMapper.toRecruiter(recruiterDTO);
        Recruiter savedRecruiter = recruiterRepository.save(recruiter);

        return dtoMapper.toRecruiterDTO(savedRecruiter);
    }

    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }
}
