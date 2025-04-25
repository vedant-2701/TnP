// package com.tnp.tnpbackend.serviceImpl;

// import java.io.IOException;
// import java.util.ArrayList;
// import java.util.List;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import com.tnp.tnpbackend.dto.AddRecruiterResponse;
// import com.tnp.tnpbackend.dto.RecruiterDTO;
// import com.tnp.tnpbackend.dto.StudentSummaryDTO;
// import com.tnp.tnpbackend.exception.FileProcessingException;
// import com.tnp.tnpbackend.exception.NoDataFoundException;
// import com.tnp.tnpbackend.model.Recruiter;
// import com.tnp.tnpbackend.model.RecruiterCriteria;
// import com.tnp.tnpbackend.model.Student;
// import com.tnp.tnpbackend.repository.RecruiterRepository;
// import com.tnp.tnpbackend.repository.StudentRepository;
// import com.tnp.tnpbackend.service.CloudinaryService;
// import com.tnp.tnpbackend.service.RecruiterService;
// import com.tnp.tnpbackend.utils.DTOMapper;
// import com.tnp.tnpbackend.utils.EmailService;

// @Service
// public class RecruiterServiceImpl implements RecruiterService {

//     // @Autowired
//     // private RecruiterRepository recruiterRepository;

//     // @Autowired
//     // private DTOMapper dtoMapper;

//     // public RecruiterDTO addRecruiter(RecruiterDTO recruiterDTO) {
//     //     if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
//     //         throw new IllegalArgumentException("Company name cannot be empty");
//     //     }
//     //     if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
//     //         throw new IllegalArgumentException("Job role cannot be empty");
//     //     }

//     //     Recruiter recruiter = dtoMapper.toRecruiter(recruiterDTO);
//     //     Recruiter savedRecruiter = recruiterRepository.save(recruiter);

//     //     return dtoMapper.toRecruiterDTO(savedRecruiter);
//     // }

//     @Autowired
//     private RecruiterRepository recruiterRepository;

//     @Autowired
//     private StudentRepository studentRepository;

//     @Autowired
//     private EmailService mailService;

//      @Autowired
//     private CloudinaryService cloudinaryService;

//     @Autowired
//     private DTOMapper dtoMapper;

    

// //     public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO) {
// //         //Recruiter existingRecruiter = recruiterRepository.findBycompanyWebsite(recruiterDTO.getCompanyWebsite());
// //         System.out.println(recruiterDTO.toString());
// //         // Validate input
// //         if (recruiterDTO.getCompanyWebsite() == null || recruiterDTO.getCompanyWebsite().isBlank()) {
// //             throw new IllegalArgumentException("Company website cannot be empty");
// //         }
// //         if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
// //             throw new IllegalArgumentException("Company name cannot be empty");
// //         }
// //         if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
// //             throw new IllegalArgumentException("Job role cannot be empty");
// //         }

// //         // Fetch the existing recruiter by companyWebsite
// //         Recruiter recruiter = recruiterRepository.findBycompanyWebsite(recruiterDTO.getCompanyWebsite());
// //         if (recruiter == null) {
// //             throw new NoDataFoundException("Recruiter not found for the provided company website");
// //         }
// //         if(!recruiter.getCompanyWebsite().equals(recruiterDTO.getCompanyWebsite())) {
// //             throw new IllegalArgumentException("Company website does not match the existing recruiter");
// //         }
// //         // Map DTO to entity and set timestamps
// //         recruiter.setCompanyName(recruiterDTO.getCompanyName());
// //         recruiter.setJobRole(recruiterDTO.getJobRole());
// //         recruiter.setJobDescription(recruiterDTO.getJobDescription());
// //         recruiter.setCompanyLocation(recruiterDTO.getCompanyLocation());
// //         recruiter.setCompanyDescription(recruiterDTO.getCompanyDescription());
// //         recruiter.setIndustryType(recruiterDTO.getIndustryType());
// //         recruiter.setCriteria(recruiterDTO.getCriteria());
// //         recruiter.setDeadline(recruiterDTO.getDeadline());

// //         recruiter.setCreatedAt(java.time.LocalDateTime.now());
// //         recruiter.setUpdatedAt(java.time.LocalDateTime.now());
        

// //        System.out.println("Recruiter: " + recruiter);
// //         // Save recruiter to MongoDB
// //         Recruiter savedRecruiter = recruiterRepository.save(recruiter);

// //         // Filter and notify eligible students, get the list of selected students
// //         List<StudentSummaryDTO> selectedStudents = filterAndNotifyEligibleStudents(savedRecruiter);

// //         // Prepare response with recruiter and selected students
// //         AddRecruiterResponse response = new AddRecruiterResponse();
// //         response.setRecruiter(dtoMapper.toRecruiterDTO(savedRecruiter));
// //         response.setSelectedStudents(selectedStudents); // Renamed for clarity

// //         return response;
// //     }

    
// // private List<StudentSummaryDTO> filterAndNotifyEligibleStudents(Recruiter recruiter) {
// //     RecruiterCriteria criteria = new RecruiterCriteria(recruiter.getCriteria(), recruiter.getJobDescription());
// //     List<Student> allStudents = studentRepository.findAll();
// //     if (allStudents.isEmpty()) {
// //         throw new NoDataFoundException("No Student data found");
// //     }
// //     List<Student> selectedStudents = new ArrayList<>();

// //     for (Student student : allStudents) {
// //         if (criteria.isStudentEligible(student)) {
// //             // Add recruiterId to student's shortlistedFor list
// //             if (!student.getShortlistedFor().contains(recruiter.getRecruiterId())) {
// //                 student.getShortlistedFor().add(recruiter.getRecruiterId());
// //                 studentRepository.save(student); // Update student in DB
// //             }
// //             selectedStudents.add(student);
// //         }
// //     }

// //     notifyStudents(selectedStudents, recruiter);

// //     return dtoMapper.toStudentSummaryDTOList(selectedStudents);
// // }

// // private void notifyStudents(List<Student> students, Recruiter recruiter) {
// //     String subject = "Job Opportunity at " + recruiter.getCompanyName();
// //     String bodyTemplate = "Dear %s,\nYou are eligible for the %s role at %s.\nDescription: %s\nDeadline: %s\nApply now!";

// //     for (Student student : students) {
// //         String body = String.format(bodyTemplate,
// //                 student.getStudentName(),
// //                 recruiter.getJobRole(),
// //                 recruiter.getCompanyName(),
// //                 recruiter.getJobDescription(),
// //                 recruiter.getDeadline());
// //         // Send email asynchronously
// //         mailService.sendEmailAsync(student.getEmail(), subject, body);
// //     }
// //     System.out.println("Queued emails for recruiter");
// // }



//     public List<StudentSummaryDTO> getAppliedStudents(String recruiterId) {
//         List<Student> students = studentRepository.findByShortlistedFor(recruiterId);
//         if (students.isEmpty()) {
//             throw new NoDataFoundException("No students have applied for this recruiter.");
//         }
//         return dtoMapper.toStudentSummaryDTOList(students);
//     }

//     public List<StudentSummaryDTO> getNotappliedStudents(String recruiterId) {
//         List<Student> students = studentRepository.findAll();
//         List<Student> notAppliedStudents = new ArrayList<>();

//         for (Student student : students) {
//             if (!student.getShortlistedFor().contains(recruiterId)) {
//                 notAppliedStudents.add(student);
//             }
//         }

//         if (notAppliedStudents.isEmpty()) {
//             throw new NoDataFoundException("All students have applied for this recruiter.");
//         }
//         return  dtoMapper.toStudentSummaryDTOList(students);
//     }

//     @Override
//     public List<RecruiterDTO> getAllRecruiters() {
//         List<Recruiter> recruiters = recruiterRepository.findAll();
//         if(recruiters.isEmpty()) {
//             throw new NoDataFoundException("No Recruiter data found");
//         }
//         return dtoMapper.toRecruiterDTOList(recruiters);
//     }

//     public RecruiterDTO uploadLogo(MultipartFile logo,String companyWebsite) {
//         // Recruiter recruiter = recruiterRepository.findBycompanyWebsite(companyWebsite);
//         // if (recruiter == null) {
//         //     throw new NoDataFoundException("Recruiter not found.");
//         // }
//         // try {
//         //     String imageUrl = cloudinaryService.uploadImage(logo);
//         //     recruiter.setCompanyLogoUrl(imageUrl);
//         //     recruiterRepository.save(recruiter); // Save the recruiter with the logo URL
//         // } catch (IOException e) {
//         //     throw new FileProcessingException("Failed to upload logo", e);
//         // }
//         // return dtoMapper.toRecruiterDTO(recruiter);
//         if (companyWebsite == null || companyWebsite.isBlank()) {
//             throw new IllegalArgumentException("Company website cannot be empty");
//         }

//         // Check if recruiter with this website already exists
//         Recruiter existingRecruiter = recruiterRepository.findBycompanyWebsite(companyWebsite);
//         if (existingRecruiter != null) {
//             throw new IllegalArgumentException("Recruiter with this company website already exists");
//         }

//         // Create a new recruiter with only website and logo
//         Recruiter recruiter = new Recruiter();
//         recruiter.setCompanyWebsite(companyWebsite);
//         recruiter.setCreatedAt(java.time.LocalDateTime.now());
//         recruiter.setUpdatedAt(java.time.LocalDateTime.now());

//         // Upload logo to Cloudinary and set the URL
//         try {
//             String imageUrl = cloudinaryService.uploadImage(logo);
//             recruiter.setCompanyLogoUrl(imageUrl);
//         } catch (IOException e) {
//             throw new FileProcessingException("Failed to upload logo", e);
//         }

//         // Save the recruiter to MongoDB
//         Recruiter savedRecruiter = recruiterRepository.save(recruiter);
//         return dtoMapper.toRecruiterDTO(savedRecruiter);
//     }

//     public RecruiterDTO getRecruiterById(String id) {
//         if (id == null || id.isEmpty()) {
//             throw new IllegalArgumentException("Invalid ID provided.");
//         }
//         Recruiter recruiter = recruiterRepository.findById(id).orElseThrow(() -> new NoDataFoundException("Recruiter not found."));
//         return dtoMapper.toRecruiterDTO(recruiter);
//     }

// }

package com.tnp.tnpbackend.serviceImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
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

    public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO) {
        System.out.println(recruiterDTO.toString());
        // Validate input
        if (recruiterDTO.getCompanyWebsite() == null || recruiterDTO.getCompanyWebsite().isBlank()) {
            throw new IllegalArgumentException("Company website cannot be empty");
        }
        if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
            throw new IllegalArgumentException("Company name cannot be empty");
        }
        if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
            throw new IllegalArgumentException("Job role cannot be empty");
        }

        // Fetch the existing recruiter by companyWebsite
        Recruiter recruiter = recruiterRepository.findBycompanyWebsite(recruiterDTO.getCompanyWebsite());
        if (recruiter == null) {
            throw new NoDataFoundException("Recruiter not found for the provided company website");
        }
        if(!recruiter.getCompanyWebsite().equals(recruiterDTO.getCompanyWebsite())) {
            throw new IllegalArgumentException("Company website does not match the existing recruiter");
        }
        // Map DTO to entity and set timestamps
        recruiter.setCompanyName(recruiterDTO.getCompanyName());
        recruiter.setJobRole(recruiterDTO.getJobRole());
        recruiter.setJobDescription(recruiterDTO.getJobDescription());
        recruiter.setCompanyLocation(recruiterDTO.getCompanyLocation());
        recruiter.setCompanyDescription(recruiterDTO.getCompanyDescription());
        recruiter.setIndustryType(recruiterDTO.getIndustryType());
        recruiter.setNotified(false); // Set notified to false initially
        recruiter.setCriteria(recruiterDTO.getCriteria());
        recruiter.setDeadline(recruiterDTO.getDeadline());

        recruiter.setCreatedAt(java.time.LocalDateTime.now());
        recruiter.setUpdatedAt(java.time.LocalDateTime.now());


        // Filter eligible students
        RecruiterCriteria criteria = new RecruiterCriteria(recruiter.getCriteria(), recruiter.getJobDescription());
        List<Student> allStudents = studentRepository.findAll();
        if (allStudents.isEmpty()) {
            throw new NoDataFoundException("No student data found");
        }
        List<Student> selectedStudents = new ArrayList<>();

        for (Student student : allStudents) {
            if (criteria.isStudentEligible(student)) {
                // Add recruiterId to student's shortlistedFor list
                if (!student.getShortlistedFor().contains(recruiter.getRecruiterId())) {
                    student.getShortlistedFor().add(recruiter.getRecruiterId());
                    studentRepository.save(student);
                }
                selectedStudents.add(student);
            }
        }

        // Store eligible student IDs
        List<String> eligibleStudentIds = selectedStudents.stream()
                .map(Student::getStudentId)
                .collect(Collectors.toList());
        recruiter.setEligibleStudentIds(eligibleStudentIds);

        // Save recruiter to MongoDB
        Recruiter savedRecruiter = recruiterRepository.save(recruiter);

        // Prepare response
        AddRecruiterResponse response = new AddRecruiterResponse();
        response.setRecruiter(dtoMapper.toRecruiterDTO(savedRecruiter));
        response.setSelectedStudents(dtoMapper.toStudentSummaryDTOList(selectedStudents));

        return response;
    }

    public void notifyStudentsByRecruiterId(String recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new NoDataFoundException("Recruiter not found with id: " + recruiterId));

        if (recruiter.isNotified()) {
            System.out.println("Emails already sent for recruiter: " + recruiter.getCompanyName());
            return;
        }

        List<String> eligibleStudentIds = recruiter.getEligibleStudentIds();
        if (eligibleStudentIds == null || eligibleStudentIds.isEmpty()) {
            System.out.println("No eligible students for recruiter: " + recruiter.getCompanyName());
            return;
        }

        List<Student> eligibleStudents = studentRepository.findAllById(eligibleStudentIds);
        if (eligibleStudents.isEmpty()) {
            System.out.println("No eligible students found for recruiter: " + recruiter.getCompanyName());
            return;
        }

        String subject = "Job Opportunity at " + recruiter.getCompanyName();
        String bodyTemplate = "Dear %s,\nYou are eligible for the %s role at %s.\nDescription: %s\nDeadline: %s\nApply now!";

        for (Student student : eligibleStudents) {
            String body = String.format(bodyTemplate,
                    student.getStudentName(),
                    recruiter.getJobRole(),
                    recruiter.getCompanyName(),
                    recruiter.getJobDescription(),
                    recruiter.getDeadline());
            try {
                mailService.sendEmailAsync(student.getEmail(), subject, body);
                System.out.println("Email queued for " + student.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to queue email to " + student.getEmail() + ": " + e.getMessage());
            }
        }

        // Mark emails as sent
        recruiter.setNotified(true);
        recruiterRepository.save(recruiter);
        System.out.println("Queued " + eligibleStudents.size() + " emails for recruiter " + recruiter.getCompanyName());
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
        return dtoMapper.toStudentSummaryDTOList(notAppliedStudents); // Fixed to return notAppliedStudents
    }

    @Override
    public List<RecruiterDTO> getAllRecruiters() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        if (recruiters.isEmpty()) {
            throw new NoDataFoundException("No Recruiter data found");
        }
        return dtoMapper.toRecruiterDTOList(recruiters);
    }

    public RecruiterDTO uploadLogo(MultipartFile logo, String companyWebsite) {
        if (companyWebsite == null || companyWebsite.isBlank()) {
            throw new IllegalArgumentException("Company website cannot be empty");
        }

        // Check if recruiter with this website already exists
        Recruiter existingRecruiter = recruiterRepository.findBycompanyWebsite(companyWebsite);
        if (existingRecruiter != null) {
            throw new IllegalArgumentException("Recruiter with this company website already exists");
        }

        // Create a new recruiter with only website and logo
        Recruiter recruiter = new Recruiter();
        recruiter.setCompanyWebsite(companyWebsite);
        recruiter.setCreatedAt(java.time.LocalDateTime.now());
        recruiter.setUpdatedAt(java.time.LocalDateTime.now());

        // Upload logo to Cloudinary and set the URL
        try {
            String imageUrl = cloudinaryService.uploadImage(logo);
            recruiter.setCompanyLogoUrl(imageUrl);
        } catch (IOException e) {
            throw new FileProcessingException("Failed to upload logo", e);
        }

        // Save the recruiter to MongoDB
        Recruiter savedRecruiter = recruiterRepository.save(recruiter);
        return dtoMapper.toRecruiterDTO(savedRecruiter);
    }

    public RecruiterDTO getRecruiterById(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Invalid ID provided.");
        }
        Recruiter recruiter = recruiterRepository.findById(id).orElseThrow(() -> new NoDataFoundException("Recruiter not found."));
        return dtoMapper.toRecruiterDTO(recruiter);
    }
}