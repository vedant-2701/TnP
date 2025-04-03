package com.tnp.tnpbackend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.utils.DTOMapper;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DTOMapper dtoMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    public StudentDTO addStudent(StudentDTO studentDTO) {  
        Student student = dtoMapper.toStudent(studentDTO);
        // Encode the password before saving
        student.setPassword(passwordEncoder.encode(student.getPassword()));

        // Ensure the role is valid and prefixed with "ROLE_"
        String role = student.getRole();
        if (role == null || role.isEmpty()) {
            student.setRole(Role.ROLE_STUDENT);
        } else if (!role.startsWith("ROLE_")) {
            student.setRole("ROLE_" + role);
        }

        // Set creation timestamp
        student.setCreatedAt(LocalDateTime.now());

        Student savedStudent = studentRepository.save(student);
        return dtoMapper.toStudentDto(savedStudent);
    }

    public StudentDTO updateProfile(StudentDTO studentDTO) {
        // Log incoming DTO for debugging
        System.out.println("Incoming StudentDTO: " + studentDTO);

        String autheticatedUsername = getAuthenticatedUsername();

        if (studentDTO.getUsername() == null || studentDTO.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (!autheticatedUsername.equals(studentDTO.getUsername())) {
            throw new SecurityException("You are not authorized to update another student's profile");
        }

        boolean exists = studentRepository.existsByUsername(studentDTO.getUsername());
        if (!exists) {
            throw new RuntimeException("Student with username " + studentDTO.getUsername() + " does not exist");
        }

        Student existingStudent = studentRepository.findByUsername(studentDTO.getUsername())
            .orElseThrow(() -> new RuntimeException("Student not found despite existence check"));

        // Map DTO to Student with new values
        // Student updatedStudent = dtoMapper.toStudent(studentDTO);

        // // Preserve critical fields from existing student
        // updatedStudent.setStudentId(existingStudent.getStudentId());
        // updatedStudent.setUsername(existingStudent.getUsername());
        // updatedStudent.setRole(existingStudent.getRole());
        // updatedStudent.setCreatedAt(existingStudent.getCreatedAt()); // Preserve original creation date
        // updatedStudent.setDepartment(existingStudent.getDepartment());

        


       
        // //update only if provided
        // if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
        //     updatedStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        // } else {
        //     updatedStudent.setPassword(existingStudent.getPassword());
        // }

        // //maintainng persistency of studeent type 
        // if (existingStudent.getStudentType() != null) {
        //     updatedStudent.setStudentType(existingStudent.getStudentType());
        // } else if (updatedStudent.getStudentType() != null) {
        //     String studentType = updatedStudent.getStudentType().toUpperCase();
        //     if (!"REGULAR".equals(studentType) && !"DIPLOMA".equals(studentType)) {
        //         throw new IllegalArgumentException("Student type must be REGULAR or DIPLOMA");
        //     }
        //     if (updatedStudent.getHigherSecondaryMarks() == 0.0) {
        //         throw new IllegalArgumentException("Higher secondary marks are required when student type is specified");
        //     }
        // }

        // // Set update timestamp
        // System.out.println(LocalDateTime.now());
        // updatedStudent.setUpdatedAt(LocalDateTime.now());

        // // Log mapped student for debugging
        // System.out.println("Mapped Student: " + updatedStudent);

        // // Save and return updated DTO
        // Student savedStudent = studentRepository.save(updatedStudent);
        // StudentDTO updatedDTO = dtoMapper.toStudentDto(savedStudent);
        Student updatedStudent = existingStudent;

        // Selectively update fields from DTO
        if (studentDTO.getStudentName() != null) {
            updatedStudent.setStudentName(studentDTO.getStudentName());
        }
        if (studentDTO.getEmail() != null) {
            updatedStudent.setEmail(studentDTO.getEmail());
        }
        if (studentDTO.getContactNumber() != null) {
            updatedStudent.setContactNumber(studentDTO.getContactNumber());
        }
        if (studentDTO.getCgpa() != 0.0) {
            updatedStudent.setCgpa(studentDTO.getCgpa());
        }
        if (studentDTO.getHigherSecondaryMarks() != 0.0) {
            updatedStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
        }
        if (studentDTO.getTenMarks() != 0.0) {
            updatedStudent.setTenMarks(studentDTO.getTenMarks());
        }

        // Password update
        if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
            updatedStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        }

        // Student type logic
        if (existingStudent.getStudentType() != null) {
            updatedStudent.setStudentType(existingStudent.getStudentType());
        } else if (studentDTO.getStudentType() != null) {
            String studentType = studentDTO.getStudentType().toUpperCase();
            if (!"REGULAR".equals(studentType) && !"DIPLOMA".equals(studentType)) {
                throw new IllegalArgumentException("Student type must be REGULAR or DIPLOMA");
            }
            if (studentDTO.getHigherSecondaryMarks() == 0.0) {
                throw new IllegalArgumentException("Higher secondary marks are required when student type is specified");
            }
            updatedStudent.setStudentType(studentType);
            updatedStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
        }

        updatedStudent.setUpdatedAt(LocalDateTime.now());
       

        Student savedStudent = studentRepository.save(updatedStudent);
        StudentDTO updatedDTO = dtoMapper.toStudentDto(savedStudent);
        System.out.println("Updated StudentDTO: " + updatedDTO);
        return updatedDTO;
    }

    public StudentDTO updateProfilePicture(MultipartFile profileImage) throws java.io.IOException {
        String authenticatedUsername = getAuthenticatedUsername();
        Student existingStudent = studentRepository.findByUsername(authenticatedUsername)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        if (profileImage == null || profileImage.isEmpty()) {
            throw new IllegalArgumentException("Profile image cannot be null or empty");
        }

        try {
            String imageUrl = cloudinaryService.uploadImage(profileImage);
            existingStudent.setProfileImageURL(imageUrl);
            existingStudent.setUpdatedAt(LocalDateTime.now());
            Student savedStudent = studentRepository.save(existingStudent);
            return dtoMapper.toStudentDto(savedStudent);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture: " + e.getMessage());
        }
    }

    public List<StudentSummaryDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            throw new RuntimeException("No students found");
        }
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    public StudentDTO getStudentById(String id) {
        if (id == null || id.isEmpty()) {
            throw new RuntimeException("Invalid ID provided");
        }
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return dtoMapper.toStudentDto(student);
    }

    public List<StudentSummaryDTO> getStudentsByDepartment(String department) {
        if (department == null || department.isEmpty()) {
            throw new RuntimeException("Invalid department provided");
        }
        List<Student> students = studentRepository.findByDepartment(department);
        if (students.isEmpty()) {
            throw new RuntimeException("No students found in department: " + department);
        }
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    public List<String> findDistinctDepartments() {
        List<String> departments = mongoTemplate.findDistinct("department", Student.class, String.class);
        return departments.isEmpty() ? List.of() : departments;
    }

    public StudentDTO getStudentByDepartmentAndId(String department, String studentId) {
        if (studentId == null || studentId.isEmpty()) {
            throw new RuntimeException("Invalid student ID provided");
        }
        if (department == null || department.isEmpty()) {
            throw new RuntimeException("Invalid department provided");
        }

        Optional<Student> student = studentRepository.findByDepartmentAndStudentId(department, studentId);
        return student.map(dtoMapper::toStudentDto)
                     .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId + " in department: " + department));
    }

    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString(); // Fallback for custom principal
        }
    }

    public List<Recruiter> getMyHistory(String studentId) {
        if (studentId == null || studentId.isEmpty()) {
            throw new RuntimeException("Invalid student ID provided");
        }
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        List<Recruiter> recruiters = student.getShortlistedFor().stream()
            .map(recruiterId -> recruiterRepository.findById(recruiterId).orElse(null))
            .collect(Collectors.toList());
        return recruiters;
    }
}