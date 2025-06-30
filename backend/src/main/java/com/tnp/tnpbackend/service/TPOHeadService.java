package com.tnp.tnpbackend.service;

import java.util.List;

import com.tnp.tnpbackend.dto.TPOHeadDTO;
import com.tnp.tnpbackend.model.Recruiter;

public interface TPOHeadService {
    public void save(TPOHeadDTO tpoHead);

    public List<Recruiter> getAllCompanies();

    
}
