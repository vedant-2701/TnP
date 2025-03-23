package com.tnp.tnpbackend.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentExcelDTO;
import com.tnp.tnpbackend.model.Student;

@Component
public class DTOMapper {
    public StudentDTO toStudentDto(Student student){
        StudentDTO studDto = new StudentDTO();
        
        if(student == null){
            return null;
        }

        studDto.setStudentId(student.getStudentId());
        studDto.setStudentName(student.getStudentName());
        studDto.setUserName(student.getUsername());
        studDto.setEmail(student.getEmail());
        studDto.setCgpa(student.getCgpa());
        studDto.setDepartment(student.getDepartment() != null ? student.getDepartment().getDepartmentId() : 0);
        studDto.setSkills(student.getSkills());
        studDto.setResumeURL(student.getResumeURL());
        studDto.setAcademicYear(student.getAcademicYear() != null ? student.getAcademicYear().getYearName() : null);
        studDto.setBacklogs(student.getBacklogs());
        studDto.setGraduationYear(student.getGraduationYear());
        studDto.setContactNumber(student.getContactNumber());
        studDto.setCreatedAt(student.getCreatedAt());
        studDto.setUpdatedAt(student.getUpdatedAt());
        studDto.setRole(student.getRole());
        
        return studDto;
    }

    public Student toStudent(StudentDTO dto){
        Student stud = new Student();
        
        if(dto == null){
            return null;
        }

        stud.setStudentId(dto.getStudentId());
        stud.setStudentName(dto.getStudentName());
        stud.setUsername(dto.getUserName());
        stud.setEmail(dto.getEmail());
        stud.setCgpa(dto.getCgpa());
        //stud.setDepartment(dto.getDepartment());
        stud.setSkills(dto.getSkills());
        stud.setResumeURL(dto.getResumeURL());
        //stud.setAcademicYear(student.getAcademicYear() != null ? student.getAcademicYear().getYearName() : null);
        stud.setBacklogs(dto.getBacklogs());
        stud.setGraduationYear(dto.getGraduationYear());
        stud.setContactNumber(dto.getContactNumber());
        stud.setCreatedAt(dto.getCreatedAt());
        stud.setUpdatedAt(dto.getUpdatedAt());
        stud.setRole(dto.getRole());        

        return stud;
    }

    public StudentExcelDTO toStudentExcelDTO(Student student) {
        if (student == null) return null;

        StudentExcelDTO dto = new StudentExcelDTO();
        dto.setUsername(student.getUsername());
        dto.setPassword(student.getPassword()); // Raw password, to be encoded later
        return dto;
    }

    // StudentExcelDTO to Student
    public Student toStudentexel(StudentExcelDTO dto) {
        if (dto == null) return null;

        Student student = new Student();
        student.setUsername(dto.getUsername());
        student.setPassword(dto.getPassword()); // Password should be encoded in service layer
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
}
