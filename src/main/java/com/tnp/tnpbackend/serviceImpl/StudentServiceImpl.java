package com.tnp.tnpbackend.serviceImpl;

import com.tnp.tnpbackend.dto.StudentApplicationHistoryDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;
import com.tnp.tnpbackend.repository.StudentRecruiterRelationRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.CloudinaryService;
import com.tnp.tnpbackend.service.StudentService;
import com.tnp.tnpbackend.utils.DTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
        Student student = dtoMapper.toStudent(studentDTO);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        String role = student.getRole();
        if (role == null || role.isEmpty()) {
            student.setRole(Role.ROLE_STUDENT);
        } else if (!role.startsWith("ROLE_")) {
            student.setRole("ROLE_" + role);
        }
        student.setCreatedAt(LocalDateTime.now());
        Student savedStudent = studentRepository.save(student);
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    public StudentDTO updateProfile(StudentDTO studentDTO) {
        String authenticatedUsername = getAuthenticatedUsername();
        if (studentDTO.getUsername() == null || studentDTO.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (!authenticatedUsername.equals(studentDTO.getUsername())) {
            throw new SecurityException("You are not authorized to update another student's profile");
        }
        boolean exists = studentRepository.existsByUsername(studentDTO.getUsername());
        if (!exists) {
            throw new RuntimeException("Student with username " + studentDTO.getUsername() + " does not exist");
        }
        Student existingStudent = studentRepository.findByUsername(studentDTO.getUsername())
            .orElseThrow(() -> new RuntimeException("Student not found despite existence check"));

        Student updatedStudent = existingStudent;
        if (studentDTO.getStudentName() != null) updatedStudent.setStudentName(studentDTO.getStudentName());
        if (studentDTO.getEmail() != null) updatedStudent.setEmail(studentDTO.getEmail());
        if (studentDTO.getContactNumber() != null) updatedStudent.setContactNumber(studentDTO.getContactNumber());
        if (studentDTO.getCgpa() != 0.0) updatedStudent.setCgpa(studentDTO.getCgpa());
        if (studentDTO.getHigherSecondaryMarks() != 0.0) updatedStudent.setHigherSecondaryMarks(studentDTO.getHigherSecondaryMarks());
        if (studentDTO.getTenMarks() != 0.0) updatedStudent.setTenMarks(studentDTO.getTenMarks());
        if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
            updatedStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        }
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
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    public StudentDTO updateProfilePicture(MultipartFile profileImage) throws IOException {
        String authenticatedUsername = getAuthenticatedUsername();
        Student existingStudent = studentRepository.findByUsername(authenticatedUsername)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        if (profileImage == null || profileImage.isEmpty()) {
            throw new IllegalArgumentException("Profile image cannot be null or empty");
        }
        String imageUrl = cloudinaryService.uploadImage(profileImage);
        existingStudent.setProfileImageURL(imageUrl);
        existingStudent.setUpdatedAt(LocalDateTime.now());
        Student savedStudent = studentRepository.save(existingStudent);
        return dtoMapper.toStudentDto(savedStudent);
    }

    @Override
    public List<StudentSummaryDTO> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) throw new RuntimeException("No students found");
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    @Override
    public StudentDTO getStudentById(String id) {
        if (id == null || id.isEmpty()) throw new RuntimeException("Invalid ID provided");
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));
        return dtoMapper.toStudentDto(student);
    }

    @Override
    public List<StudentSummaryDTO> getStudentsByDepartment(String department) {
        if (department == null || department.isEmpty()) throw new RuntimeException("Invalid department provided");
        List<Student> students = studentRepository.findByDepartment(department);
        if (students.isEmpty()) throw new RuntimeException("No students found in department: " + department);
        return dtoMapper.toStudentSummaryDTOList(students);
    }

    @Override
    public List<String> findDistinctDepartments() {
        List<String> departments = mongoTemplate.findDistinct("department", Student.class, String.class);
        return departments.isEmpty() ? List.of() : departments;
    }

    @Override
    public StudentDTO getStudentByDepartmentAndId(String department, String studentId) {
        if (studentId == null || studentId.isEmpty()) throw new RuntimeException("Invalid student ID provided");
        if (department == null || department.isEmpty()) throw new RuntimeException("Invalid department provided");
        Optional<Student> student = studentRepository.findByDepartmentAndStudentId(department, studentId);
        return student.map(dtoMapper::toStudentDto)
                     .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId + " in department: " + department));
    }

    @Override
    public List<StudentApplicationHistoryDTO> getMyHistory(String studentId) {
        if (studentId == null || studentId.isEmpty()) {
            throw new RuntimeException("Invalid student ID provided");
        }
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        
        List<StudentRecruiterRelation> relations = relationRepository.findByStudent(student);
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
            throw new IllegalArgumentException("Relation ID cannot be null or empty");
        }
        if (!List.of("APPLIED", "INTERVIEWED", "HIRED").contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        StudentRecruiterRelation relation = relationRepository.findById(relationId)
            .orElseThrow(() -> new RuntimeException("Application relation not found with ID: " + relationId));
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
}