package com.tnp.tnpbackend.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentExcelDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.model.Student;

@Component
public class DTOMapper {

    public StudentDTO toStudentDto(Student student) {
        StudentDTO studDto = new StudentDTO();

        if (student == null) {
            return null;
        }

        studDto.setStudentId(student.getStudentId());
        studDto.setStudentName(student.getStudentName());
        studDto.setUsername(student.getUsername());
        studDto.setPassword(student.getPassword());
        studDto.setEmail(student.getEmail());
        studDto.setCgpa(student.getCgpa());
        studDto.setDepartment(student.getDepartment());
        studDto.setSkills(student.getSkills());
        studDto.setResumeURL(student.getResumeURL());
        studDto.setAcademicYear(student.getAcademicYear());
        studDto.setBacklogs(student.getBacklogs());
        studDto.setGraduationYear(student.getGraduationYear());
        studDto.setContactNumber(student.getContactNumber());
        studDto.setTenMarks(student.getTenMarks());
        studDto.setHigherSecondaryMarks(student.getHigherSecondaryMarks());
        studDto.setStudentType(student.getStudentType());
        // Convert UTC to IST
        studDto.setCreatedAt(DateTimeConverter.convertToIST(student.getCreatedAt()));
        studDto.setUpdatedAt(DateTimeConverter.convertToIST(student.getUpdatedAt()));
        studDto.setRole(student.getRole());
        
       
        return studDto;
    }

    public Student toStudent(StudentDTO dto) {
        Student stud = new Student();

        if (dto == null) {
            return null;
        }

        stud.setStudentId(dto.getStudentId());
        stud.setStudentName(dto.getStudentName());
        stud.setUsername(dto.getUsername());
        stud.setPassword(dto.getPassword());
        stud.setEmail(dto.getEmail());
        stud.setCgpa(dto.getCgpa());
        stud.setDepartment(dto.getDepartment());
        stud.setSkills(dto.getSkills());
        stud.setResumeURL(dto.getResumeURL());
        stud.setAcademicYear(dto.getAcademicYear());
        stud.setBacklogs(dto.getBacklogs());
        stud.setGraduationYear(dto.getGraduationYear());
        stud.setContactNumber(dto.getContactNumber());
        stud.setTenMarks(dto.getTenMarks());
        stud.setHigherSecondaryMarks(dto.getHigherSecondaryMarks());
        stud.setStudentType(dto.getStudentType());
        // Store as is (assumed UTC from frontend or default)
        stud.setCreatedAt(dto.getCreatedAt());
        stud.setUpdatedAt(dto.getUpdatedAt());
        stud.setRole(dto.getRole());

       

        return stud;
    }

    public StudentExcelDTO toStudentExcelDTO(Student student) {
        if (student == null) return null;

        StudentExcelDTO dto = new StudentExcelDTO();
        dto.setUsername(student.getUsername());
        dto.setPassword(student.getPassword());
        return dto;
    }

    public Student toStudentexel(StudentExcelDTO dto) {
        if (dto == null) return null;

        Student student = new Student();
        student.setUsername(dto.getUsername());
        student.setPassword(dto.getPassword());
        return student;
    }

    public List<StudentDTO> toStudentDTOList(List<Student> students) {
        if (students == null) return null;
        return students.stream().map(this::toStudentDto).collect(Collectors.toList());
    }

    public List<Student> toStudentList(List<StudentDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(this::toStudent).collect(Collectors.toList());
    }

    public List<Student> toStudentListFromExcelDTO(List<StudentExcelDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(this::toStudentexel).collect(Collectors.toList());
    }

    public StudentSummaryDTO toStudentSummaryDto(Student student) {
        if (student == null) return null;
        StudentSummaryDTO dto = new StudentSummaryDTO();
        dto.setStudentId(student.getStudentId());
        dto.setUsername(student.getUsername());
        dto.setStudentName(student.getStudentName());
        dto.setContactNumber(student.getContactNumber());
        dto.setEmail(student.getEmail());

       

        return dto;
    }

    public List<StudentSummaryDTO> toStudentSummaryDTOList(List<Student> students) {
        if (students == null) return null;
        return students.stream().map(this::toStudentSummaryDto).collect(Collectors.toList());
    }
}