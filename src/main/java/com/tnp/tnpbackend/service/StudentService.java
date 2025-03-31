package com.tnp.tnpbackend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.model.Role;
import com.tnp.tnpbackend.model.Student;
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

        boolean exists = studentRepository.existsByUsername(studentDTO.getUserName());
        if (!exists) {
            throw new RuntimeException("Student with username " + studentDTO.getUserName() + " does not exist");
        }

        Student existingStudent = studentRepository.findByUsername(studentDTO.getUserName())
            .orElseThrow(() -> new RuntimeException("Student not found despite existence check"));

        // Map DTO to Student with new values
        Student updatedStudent = dtoMapper.toStudent(studentDTO);

        // Preserve critical fields from existing student
        updatedStudent.setStudentId(existingStudent.getStudentId());
        updatedStudent.setRole(existingStudent.getRole());
        updatedStudent.setCreatedAt(existingStudent.getCreatedAt()); // Preserve original creation date

        // Handle password: update only if provided
        if (studentDTO.getPassword() != null && !studentDTO.getPassword().isBlank()) {
            updatedStudent.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        } else {
            updatedStudent.setPassword(existingStudent.getPassword());
        }

        // Set update timestamp
        System.out.println(LocalDateTime.now());
        updatedStudent.setUpdatedAt(LocalDateTime.now());

        // Log mapped student for debugging
        System.out.println("Mapped Student: " + updatedStudent);

        // Save and return updated DTO
        Student savedStudent = studentRepository.save(updatedStudent);
        StudentDTO updatedDTO = dtoMapper.toStudentDto(savedStudent);
        
        System.out.println("Updated StudentDTO: " + updatedDTO);
        return updatedDTO;
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
}