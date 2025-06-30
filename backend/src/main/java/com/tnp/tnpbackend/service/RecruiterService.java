// package com.tnp.tnpbackend.service;

// import java.util.List;

// import com.tnp.tnpbackend.dto.AddRecruiterResponse;
// import com.tnp.tnpbackend.dto.RecruiterDTO;

// public interface RecruiterService {

//     public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO);
//     public List<RecruiterDTO> getAllRecruiters();
// }

package com.tnp.tnpbackend.service;

import com.tnp.tnpbackend.dto.AddRecruiterResponse;
import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RecruiterService {
    AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO);
    List<StudentSummaryDTO> getAppliedStudents(String recruiterId);
    List<StudentSummaryDTO> getNotappliedStudents(String recruiterId);
    List<RecruiterDTO> getAllRecruiters();
    RecruiterDTO uploadLogo(MultipartFile logo, String companyWebsite);
    RecruiterDTO getRecruiterById(String id);
    void notifyStudentsByRecruiterId(String recruiterId); // New method
}