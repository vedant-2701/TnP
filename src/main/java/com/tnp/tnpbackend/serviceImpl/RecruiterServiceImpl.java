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

    public AddRecruiterResponse addRecruiter(RecruiterDTO recruiterDTO) {
        System.out.println(recruiterDTO.toString());
        // Validate input
        if (recruiterDTO.getCompanyName() == null || recruiterDTO.getCompanyName().isBlank()) {
            throw new IllegalArgumentException("Company name cannot be empty");
        }
        if (recruiterDTO.getJobRole() == null || recruiterDTO.getJobRole().isBlank()) {
            throw new IllegalArgumentException("Job role cannot be empty");
        }

        
        // Map DTO to entity and set timestamps
        Recruiter recruiter = dtoMapper.toRecruiter(recruiterDTO);
        recruiter.setCreatedAt(java.time.LocalDateTime.now());
        recruiter.setUpdatedAt(java.time.LocalDateTime.now());

       System.out.println("Recruiter: " + recruiter);
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

    // private List<StudentSummaryDTO> filterAndNotifyEligibleStudents(Recruiter recruiter) {
    //     RecruiterCriteria criteria = new RecruiterCriteria(recruiter.getCriteria(), recruiter.getJobDescription());
    //     List<Student> allStudents = studentRepository.findAll();
    //     if (allStudents.isEmpty()) {
    //         throw new NoDataFoundException("No Student data found");
    //     }
    //     List<Student> selectedStudents = new ArrayList<>();

    //     for (Student student : allStudents) {
    //         if (criteria.isStudentEligible(student)) {
    //             // Add recruiterId to student's shortlistedFor list
    //             if (!student.getShortlistedFor().contains(recruiter.getRecruiterId())) {
    //                 student.getShortlistedFor().add(recruiter.getRecruiterId());
    //                 studentRepository.save(student); // Update student in DB
    //             }
    //             selectedStudents.add(student);
    //         }
    //     }

    //     notifyStudents(selectedStudents, recruiter);

    //     return dtoMapper.toStudentSummaryDTOList(selectedStudents);
    // }

    // private void notifyStudents(List<Student> students, Recruiter recruiter) {
    //     String subject = "Job Opportunity at " + recruiter.getCompanyName();
    //     String bodyTemplate = "Dear %s,\nYou are eligible for the %s role at %s.\nDescription: %s\nDeadline: %s\nApply now!";

    //     for (Student student : students) {
    //         String body = String.format(bodyTemplate,
    //             student.getStudentName(),
    //             recruiter.getJobRole(),
    //             recruiter.getCompanyName(),
    //             recruiter.getJobDescription(),
    //             recruiter.getDeadline());
    //         mailService.sendEmail(student.getEmail(), subject, body);
    //     }
    // }
    // public List<Recruiter> getAllRecruiters() {
    //     List<Recruiter> recruiters = recruiterRepository.findAll();
    //     if(recruiters.isEmpty()) {
    //         throw new NoDataFoundException("No Recruiter data found");
    //     }
    //     return recruiters;
    // }

//     private List<StudentSummaryDTO> filterAndNotifyEligibleStudents(Recruiter recruiter) {
//     RecruiterCriteria criteria = new RecruiterCriteria(recruiter.getCriteria(), recruiter.getJobDescription());
//     List<Student> allStudents = studentRepository.findAll();
//     if (allStudents.isEmpty()) {
//         throw new NoDataFoundException("No Student data found");
//     }
//     List<Student> selectedStudents = new ArrayList<>();

//     for (Student student : allStudents) {
//         if (criteria.isStudentEligible(student)) {
//             // Add recruiterId to student's shortlistedFor list
//             if (!student.getShortlistedFor().contains(recruiter.getRecruiterId())) {
//                 student.getShortlistedFor().add(recruiter.getRecruiterId());
//                 studentRepository.save(student); // Update student in DB
//             }
//             selectedStudents.add(student);
//         }
//     }

//     notifyStudents(selectedStudents, recruiter);

//     return dtoMapper.toStudentSummaryDTOList(selectedStudents);
// }

// private void notifyStudents(List<Student> students, Recruiter recruiter) {
//     String subject = "Job Opportunity at " + recruiter.getCompanyName();
//     String bodyTemplate = "Dear %s,\nYou are eligible for the %s role at %s.\nDescription: %s\nDeadline: %s\nApply now!";

//     // Create a thread pool with a fixed number of threads
//     int threadPoolSize = Math.min(students.size(), 10); // Limit to 10 threads or number of students
//     ExecutorService executorService = Executors.newFixedThreadPool(threadPoolSize);
//     List<Future<?>> futures = new ArrayList<>();

//     for (Student student : students) {
//         // Submit email sending task and collect the Future
//         Future<?> future = executorService.submit(() -> {
//             try {
//                 String body = String.format(bodyTemplate,
//                     student.getStudentName(),
//                     recruiter.getJobRole(),
//                     recruiter.getCompanyName(),
//                     recruiter.getJobDescription(),
//                     recruiter.getDeadline());
//                 mailService.sendEmail(student.getEmail(), subject, body);
//             } catch (Exception e) {
//                 // Log the error to avoid thread failure affecting others
//                 System.err.println("Failed to send email to " + student.getEmail() + ": " + e.getMessage());
//             }
//         });
//         futures.add(future);
//     }

//     // Shutdown the executor to prevent new tasks
//     executorService.shutdown();

//     // Wait for all tasks to complete
//     for (Future<?> future : futures) {
//         try {
//             future.get(); // Blocks until the task completes
//         } catch (Exception e) {
//             System.err.println("Error waiting for email task: " + e.getMessage());
//         }
//     }

//     // Ensure the executor is fully terminated
//     try {
//         if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
//             executorService.shutdownNow(); // Force shutdown if any tasks are still running
//             System.err.println("Some email tasks did not terminate cleanly");
//         }
//     } catch (InterruptedException e) {
//         executorService.shutdownNow();
//         Thread.currentThread().interrupt(); // Restore interrupted status
//         System.err.println("Email sending interrupted: " + e.getMessage());
//     }
// }
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
        // Send email asynchronously
        mailService.sendEmailAsync(student.getEmail(), subject, body);
    }
    System.out.println("Queued emails for recruiter");
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

    @Override
    public List<RecruiterDTO> getAllRecruiters() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        if(recruiters.isEmpty()) {
            throw new NoDataFoundException("No Recruiter data found");
        }
        return dtoMapper.toRecruiterDTOList(recruiters);
    }

    public RecruiterDTO uploadLogo(MultipartFile logo) {
        Recruiter recruiter = new Recruiter();
        try {
            String imageUrl = cloudinaryService.uploadImage(logo);
            recruiter.setCompanyLogoUrl(imageUrl);
            recruiterRepository.save(recruiter); // Save the recruiter with the logo URL
        } catch (IOException e) {
            throw new FileProcessingException("Failed to upload logo", e);
        }
        return dtoMapper.toRecruiterDTO(recruiter);
    }

    public RecruiterDTO getRecruiterById(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Invalid ID provided.");
        }
        Recruiter recruiter = recruiterRepository.findById(id).orElseThrow(() -> new NoDataFoundException("Recruiter not found."));
        return dtoMapper.toRecruiterDTO(recruiter);
    }

}
