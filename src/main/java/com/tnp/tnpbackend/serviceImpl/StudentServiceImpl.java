package com.tnp.tnpbackend.serviceImpl;

import com.tnp.tnpbackend.dto.StudentApplicationHistoryDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.exception.*;
import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;
import com.tnp.tnpbackend.repository.StudentRecruiterRelationRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.CloudinaryService;
import com.tnp.tnpbackend.service.StudentService;
import com.tnp.tnpbackend.utils.DTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DTOMapper dtoMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private StudentRecruiterRelationRepository relationRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public StudentDTO addStudent(StudentDTO studentDTO) {
        if (studentDTO == null) {
            throw new InvalidInputException("Student data cannot be null");
        }
        Student student = dtoMapper.toStudent(studentDTO);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        String role = student.getRole();
        if (role == null || role.isEmpty()) {
            student.setRole(Role.ROLE_STUDENT);
        } else if (!role.startsWith("ROLE_")) {
            student.setRole("ROLE_" + role);
        }
        student.setCreatedAt(LocalDateTime.now());
        student.setActive(true);
        Student savedStudent = studentRepository.save(student);
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    public StudentDTO updateProfile(StudentDTO studentDTO) {
        String authenticatedUsername = getAuthenticatedUsername();
        if (studentDTO.getUsername() == null || studentDTO.getUsername().isBlank()) {
            throw new InvalidInputException("Username cannot be null or empty");
        }
        if (!authenticatedUsername.equals(studentDTO.getUsername())) {
            throw new UnauthorizedAccessException("You are not authorized to update another student's profile");
        }
        boolean exists = studentRepository.existsByUsername(studentDTO.getUsername());
        if (!exists) {
            throw new StudentNotFoundException("Student with username " + studentDTO.getUsername() + " does not exist");
        }
        Student existingStudent = studentRepository.findByUsername(studentDTO.getUsername())
                .orElseThrow(() -> new StudentNotFoundException(
                        "Student not found with username: " + studentDTO.getUsername()));
        if(existingStudent.isEmailVerified() == false) {
            throw new InvalidInputException("Email not verified. Please verify your email before updating profile.");
        }

        Student updatedStudent = existingStudent;
        if (studentDTO.getStudentName() != null)
            updatedStudent.setStudentName(studentDTO.getStudentName());
        if (studentDTO.getEmail() != null)
            updatedStudent.setEmail(studentDTO.getEmail());
        if (studentDTO.getContactNumber() != null)
            updatedStudent.setContactNumber(studentDTO.getContactNumber());
        if (studentDTO.getCgpa() != 0.0)
            updatedStudent.setCgpa(studentDTO.getCgpa());
        if (studentDTO.getHigherSecondaryMarks() != 0.0)
            updatedStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
        if (studentDTO.getTenthMarks() != 0.0)
            updatedStudent.setTenthMarks(studentDTO.getTenthMarks());
        if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
            updatedStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        }
        if(studentDTO.getDateOfBirth()!= null){
            updatedStudent.setDateOfBirth(studentDTO.getDateOfBirth());
        }
        if(studentDTO.getGender() != null){
            updatedStudent.setGender(studentDTO.getGender());
        }
        if(studentDTO.getResumeURL()!=null){
            updatedStudent.setResumeURL(studentDTO.getResumeURL());
        }
        if(studentDTO.getAcademicYear()!=null){
            updatedStudent.setAcademicYear(studentDTO.getAcademicYear());
        }
        if(studentDTO.getBacklogs()!=0){
            updatedStudent.setBacklogs(studentDTO.getBacklogs());
        }
        if(studentDTO.getGraduationYear()!=null){
            updatedStudent.setGraduationYear(studentDTO.getGraduationYear());
        }
        if(studentDTO.getDepartment()!=null){
            updatedStudent.setDepartment(studentDTO.getDepartment());
        }
        if(studentDTO.getSkills()!=null){
            updatedStudent.setSkills(studentDTO.getSkills());
        }
        if (studentDTO.getStudentType() != null) {
            String studentType = studentDTO.getStudentType().toUpperCase();
            if (!"REGULAR".equals(studentType) && !"DIPLOMA".equals(studentType)) {
                throw new InvalidInputException("Student type must be REGULAR or DIPLOMA");
            }
            if (studentDTO.getHigherSecondaryMarks() == 0.0) {
                throw new InvalidInputException("Higher secondary marks are required when student type is specified");
            }
            updatedStudent.setStudentType(studentType);
            updatedStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
        }
        updatedStudent.setUpdatedAt(LocalDateTime.now());
        Student savedStudent = studentRepository.save(updatedStudent);
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    public StudentDTO updateProfilePicture(MultipartFile profileImage) throws IOException {
        String authenticatedUsername = getAuthenticatedUsername();
        Student existingStudent = studentRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new StudentNotFoundException(
                        "Student not found with username: " + authenticatedUsername));
        if (profileImage == null || profileImage.isEmpty()) {
            throw new InvalidInputException("Profile image cannot be null or empty");
        }
        try {
            String imageUrl = cloudinaryService.uploadImage(profileImage);
            existingStudent.setProfileImageURL(imageUrl);
            existingStudent.setUpdatedAt(LocalDateTime.now());
            Student savedStudent = studentRepository.save(existingStudent);
            return dtoMapper.toStudentDto(savedStudent);
        } catch (IOException e) {
            throw new FileProcessingException("Failed to upload profile picture", e);
        }
    }

    @Override
    public StudentDTO updateProfileComplete(StudentDTO studentDTO, MultipartFile profileImage) throws IOException {
        String authenticatedUsername = getAuthenticatedUsername();
        if ((studentDTO == null || studentDTO.getUsername() == null || studentDTO.getUsername().isBlank()) &&
                (profileImage == null || profileImage.isEmpty())) {
            throw new InvalidInputException("At least one of profile data or profile image must be provided");
        }
        if (studentDTO != null && !authenticatedUsername.equals(studentDTO.getUsername())) {
            throw new UnauthorizedAccessException("You are not authorized to update another student's profile");
        }
        Student existingStudent = studentRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new StudentNotFoundException(
                        "Student not found with username: " + authenticatedUsername));
        if (!existingStudent.isEmailVerified()) {
            throw new InvalidInputException("Email not verified. Please verify your email before updating profile.");
        }

        // Update profile data if provided
        if (studentDTO != null) {
            if (studentDTO.getStudentName() != null)
                existingStudent.setStudentName(studentDTO.getStudentName());
            if (studentDTO.getEmail() != null)
                existingStudent.setEmail(studentDTO.getEmail());
            if (studentDTO.getContactNumber() != null)
                existingStudent.setContactNumber(studentDTO.getContactNumber());
            if (studentDTO.getCgpa() != 0.0)
                existingStudent.setCgpa(studentDTO.getCgpa());
            if (studentDTO.getHigherSecondaryMarks() != 0.0)
                existingStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
            if (studentDTO.getTenthMarks() != 0.0)
                existingStudent.setTenthMarks(studentDTO.getTenthMarks());
            if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
                existingStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
            }
            if (studentDTO.getStudentType() != null) {
                String studentType = studentDTO.getStudentType().toUpperCase();
                if (!"REGULAR".equals(studentType) && !"DIPLOMA".equals(studentType)) {
                    throw new InvalidInputException("Student type must be REGULAR or DIPLOMA");
                }
                if (studentDTO.getHigherSecondaryMarks() == 0.0) {
                    throw new InvalidInputException("Higher secondary marks are required when student type is specified");
                }
                existingStudent.setStudentType(studentType);
                existingStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
            }
        }

        // Update profile picture if provided
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(profileImage);
                existingStudent.setProfileImageURL(imageUrl);
            } catch (IOException e) {
                throw new FileProcessingException("Failed to upload profile picture", e);
            }
        }

        existingStudent.setUpdatedAt(LocalDateTime.now());
        Student savedStudent = studentRepository.save(existingStudent);
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    @Cacheable(value = "students", key = "'allStudents'")
    public List<StudentSummaryDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty())
            throw new NoDataFoundException("No students found");
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    @Override
    public StudentDTO getStudentById(String id) {
        if (id == null || id.isEmpty())
            throw new InvalidInputException("Invalid student ID provided");
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + id));
        return dtoMapper.toStudentDto(student);
    }

    @Override
    public List<StudentSummaryDTO> getStudentsByDepartment(String department) {
        if (department == null || department.isEmpty())
            throw new InvalidInputException("Invalid department provided");
        List<Student> students = studentRepository.findByDepartment(department);
        if (students.isEmpty())
            throw new NoDataFoundException("No students found in department: " + department);
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    @Override
    public List<String> findDistinctDepartments() {
        List<String> departments = mongoTemplate.findDistinct("department", Student.class, String.class);
        if (departments.isEmpty())
            throw new NoDataFoundException("No departments found");
        return departments;
    }

    @Override
    public List<String> findGraduationYears() {
        List<String> graduationYears = mongoTemplate.findDistinct("graduationYear", Student.class, String.class);
        if (graduationYears.isEmpty())
            throw new NoDataFoundException("No graduation years found");
        return graduationYears;
    }

    @Override
    public StudentDTO getStudentByDepartmentAndId(String department, String studentId) {
        if (studentId == null || studentId.isEmpty())
            throw new InvalidInputException("Invalid student ID provided");
        if (department == null || department.isEmpty())
            throw new InvalidInputException("Invalid department provided");
        Optional<Student> student = studentRepository.findByDepartmentAndStudentId(department, studentId);
        return student.map(dtoMapper::toStudentDto)
                .orElseThrow(() -> new StudentNotFoundException(
                        "Student not found with ID: " + studentId + " in department: " + department));
    }

    @Override
    public List<Student> getStudentByGraduationYear(String year) {
        if (year == null)
            throw new InvalidInputException("Invalid graduation year provided");
        if (year == null || year.isEmpty())
            throw new InvalidInputException("Invalid graduation year provided");
        List<Student> students = studentRepository.findByGraduationYear(year);
        return students;
    }

    @Override
    public List<StudentApplicationHistoryDTO> getMyHistory(String studentId) {
        if (studentId == null || studentId.isEmpty()) {
            throw new InvalidInputException("Invalid student ID provided");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student not found with ID: " + studentId));

        List<StudentRecruiterRelation> relations = relationRepository.findByStudent(student);
        if (relations.isEmpty())
            throw new NoDataFoundException("No application history found for student with ID: " + studentId);
        return relations.stream().map(relation -> {
            StudentApplicationHistoryDTO dto = new StudentApplicationHistoryDTO();
            dto.setRelationId(relation.getId());
            dto.setRecruiterId(relation.getRecruiter().getRecruiterId());
            dto.setCompanyName(relation.getRecruiter().getCompanyName());
            dto.setJobRole(relation.getRecruiter().getJobRole());
            dto.setStatus(relation.getStatus());
            dto.setAppliedAt(relation.getAppliedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateApplicationStatus(String relationId, String newStatus) {
        if (relationId == null || relationId.isEmpty()) {
            throw new InvalidInputException("Relation ID cannot be null or empty");
        }
        if (!List.of("APPLIED", "INTERVIEWED", "HIRED").contains(newStatus)) {
            throw new InvalidStatusException("Invalid status: " + newStatus);
        }
        StudentRecruiterRelation relation = relationRepository.findById(relationId)
                .orElseThrow(() -> new ApplicationNotFoundException(
                        "Application relation not found with ID: " + relationId));
        relation.setStatus(newStatus);
        relationRepository.save(relation);
    }

    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    public void markEmailVerified(String email) {
        Student student = studentRepository.findByEmail(email)
            .orElseThrow(() -> new StudentNotFoundException("Student not found with email: " + email));
        student.setEmailVerified(true);
        studentRepository.save(student);
    }

    public StudentDTO getStudentByUsername(String username) {
       Student student = studentRepository.findByUsername(username)
               .orElseThrow(() -> new StudentNotFoundException("Student not found with username: " + username));
       return dtoMapper.toStudentDto(student);
    }
}

