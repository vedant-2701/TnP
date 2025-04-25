package com.tnp.tnpbackend.serviceImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.AddRecruiterResponse;
import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.exception.FileProcessingException;
import com.tnp.tnpbackend.exception.NoDataFoundException;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.RecruiterCriteria;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.CloudinaryService;
import com.tnp.tnpbackend.service.RecruiterService;
import com.tnp.tnpbackend.utils.DTOMapper;
import com.tnp.tnpbackend.utils.EmailService;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    // @Autowired
    // private RecruiterRepository recruiterRepository;

    // @Autowired
    // private DTOMapper dtoMapper;

    // public RecruiterDTO addRecruiter(RecruiterDTO recruiterDTO) {
    //     if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
    //         throw new IllegalArgumentException("Company name cannot be empty");
    //     }
    //     if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
    //         throw new IllegalArgumentException("Job role cannot be empty");
    //     }

    //     Recruiter recruiter = dtoMapper.toRecruiter(recruiterDTO);
    //     Recruiter savedRecruiter = recruiterRepository.save(recruiter);

    //     return dtoMapper.toRecruiterDTO(savedRecruiter);
    // }

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService mailService;

     @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private DTOMapper dtoMapper;

    public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO, MultipartFile file) throws IOException {
        // Validate input
        if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
            throw new IllegalArgumentException("Company name cannot be empty");
        }
        if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
            throw new IllegalArgumentException("Job role cannot be empty");
        }

        if(file != null && !file.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(file);
                System.out.println("File uploaded: " + file.getOriginalFilename());
                recruiterDTO.setCompanyLogoUrl(imageUrl);
            } catch (IOException e) {
                throw new FileProcessingException("Failed to upload profile picture", e);
            }
           
        } else {
            throw new IllegalArgumentException("File cannot be empty");
        }
        // Map DTO to entity and set timestamps
        Recruiter recruiter = dtoMapper.toRecruiter(recruiterDTO);
        recruiter.setCreatedAt(java.time.LocalDateTime.now());
        recruiter.setUpdatedAt(java.time.LocalDateTime.now());

        recruiter.setCompanyLogoUrl(recruiterDTO.getCompanyLogoUrl());
        // Save recruiter to MongoDB
        Recruiter savedRecruiter = recruiterRepository.save(recruiter);

        // Filter and notify eligible students, get the list of selected students
        List<StudentSummaryDTO> selectedStudents = filterAndNotifyEligibleStudents(savedRecruiter);

        // Prepare response with recruiter and selected students
        AddRecruiterResponse response = new AddRecruiterResponse();
        response.setRecruiter(dtoMapper.toRecruiterDTO(savedRecruiter));
        response.setSelectedStudents(selectedStudents); // Renamed for clarity

        return response;
    }

    private List<StudentSummaryDTO> filterAndNotifyEligibleStudents(Recruiter recruiter) {
        RecruiterCriteria criteria = new RecruiterCriteria(recruiter.getCriteria(), recruiter.getJobDescription());
        List<Student> allStudents = studentRepository.findAll();
        if (allStudents.isEmpty()) {
            throw new NoDataFoundException("No Student data found");
        }
        List<Student> selectedStudents = new ArrayList<>();

        for (Student student : allStudents) {
            if (criteria.isStudentEligible(student)) {
                // Add recruiterId to student's shortlistedFor list
                if (!student.getShortlistedFor().contains(recruiter.getRecruiterId())) {
                    student.getShortlistedFor().add(recruiter.getRecruiterId());
                    studentRepository.save(student); // Update student in DB
                }
                selectedStudents.add(student);
            }
        }

        notifyStudents(selectedStudents, recruiter);

        return dtoMapper.toStudentSummaryDTOList(selectedStudents);
    }

    private void notifyStudents(List<Student> students, Recruiter recruiter) {
        String subject = "Job Opportunity at " + recruiter.getCompanyName();
        String bodyTemplate = "Dear %s,\nYou are eligible for the %s role at %s.\nDescription: %s\nDeadline: %s\nApply now!";

        for (Student student : students) {
            String body = String.format(bodyTemplate,
                student.getStudentName(),
                recruiter.getJobRole(),
                recruiter.getCompanyName(),
                recruiter.getJobDescription(),
                recruiter.getDeadline());
            mailService.sendEmail(student.getEmail(), subject, body);
        }
    }
    public List<Recruiter> getAllRecruiters() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        if(recruiters.isEmpty()) {
            throw new NoDataFoundException("No Recruiter data found");
        }
        return recruiters;
    }

    public List<StudentSummaryDTO> getAppliedStudents(String recruiterId) {
        List<Student> students = studentRepository.findByShortlistedFor(recruiterId);
        if (students.isEmpty()) {
            throw new NoDataFoundException("No students have applied for this recruiter.");
        }
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    public List<StudentSummaryDTO> getNotappliedStudents(String recruiterId) {
        List<Student> students = studentRepository.findAll();
        List<Student> notAppliedStudents = new ArrayList<>();

        for (Student student : students) {
            if (!student.getShortlistedFor().contains(recruiterId)) {
                notAppliedStudents.add(student);
            }
        }

        if (notAppliedStudents.isEmpty()) {
            throw new NoDataFoundException("All students have applied for this recruiter.");
        }
        return  dtoMapper.toStudentSummaryDTOList(students);
    }
}
