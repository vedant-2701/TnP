// package com.tnp.tnpbackend.utils;

// import java.util.List;
// import java.util.stream.Collectors;

// import org.springframework.stereotype.Component;

// import com.tnp.tnpbackend.dto.RecruiterDTO;
// import com.tnp.tnpbackend.dto.StudentDTO;
// import com.tnp.tnpbackend.dto.StudentExcelDTO;
// import com.tnp.tnpbackend.dto.StudentSummaryDTO;
// import com.tnp.tnpbackend.model.Recruiter;
// import com.tnp.tnpbackend.model.Student;

// @Component
// public class DTOMapper {

//     public StudentDTO toStudentDto(Student student) {
//         StudentDTO studDto = new StudentDTO();

//         if (student == null) {
//             return null;
//         }

//         studDto.setStudentId(student.getStudentId());
//         studDto.setStudentName(student.getStudentName());
//         studDto.setUsername(student.getUsername());
//         studDto.setPassword(student.getPassword());
//         studDto.setEmail(student.getEmail());
//         studDto.setCgpa(student.getCgpa());
//         studDto.setDepartment(student.getDepartment());
//         studDto.setSkills(student.getSkills());
//         studDto.setResumeURL(student.getResumeURL());
//         studDto.setProfileImageURL(student.getProfileImageURL()); // Added
//         studDto.setAcademicYear(student.getAcademicYear());
//         studDto.setBacklogs(student.getBacklogs());
//         studDto.setGraduationYear(student.getGraduationYear());
//         studDto.setContactNumber(student.getContactNumber());
//         studDto.setTenMarks(student.getTenMarks());
//         studDto.setHigherSecondaryMarks(student.getHigherSecondaryMarks());
//         studDto.setStudentType(student.getStudentType());
//         // Convert UTC to IST
//         studDto.setCreatedAt(DateTimeConverter.convertToIST(student.getCreatedAt()));
//         studDto.setUpdatedAt(DateTimeConverter.convertToIST(student.getUpdatedAt()));
//         studDto.setRole(student.getRole());
        
       
//         return studDto;
//     }

//     public Student toStudent(StudentDTO dto) {
//         Student stud = new Student();

//         if (dto == null) {
//             return null;
//         }

//         stud.setStudentId(dto.getStudentId());
//         stud.setStudentName(dto.getStudentName());
//         stud.setUsername(dto.getUsername());
//         stud.setPassword(dto.getPassword());
//         stud.setEmail(dto.getEmail());
//         stud.setCgpa(dto.getCgpa());
//         stud.setDepartment(dto.getDepartment());
//         stud.setSkills(dto.getSkills());
//         stud.setResumeURL(dto.getResumeURL());
//         stud.setAcademicYear(dto.getAcademicYear());
//         stud.setProfileImageURL(dto.getProfileImageURL()); // Added
//         stud.setBacklogs(dto.getBacklogs());
//         stud.setGraduationYear(dto.getGraduationYear());
//         stud.setContactNumber(dto.getContactNumber());
//         stud.setTenMarks(dto.getTenMarks());
//         stud.setHigherSecondaryMarks(dto.getHigherSecondaryMarks());
//         stud.setStudentType(dto.getStudentType());
//         // Store as is (assumed UTC from frontend or default)
//         stud.setCreatedAt(dto.getCreatedAt());
//         stud.setUpdatedAt(dto.getUpdatedAt());
//         stud.setRole(dto.getRole());

       

//         return stud;
//     }

//     public StudentExcelDTO toStudentExcelDTO(Student student) {
//         if (student == null) return null;

//         StudentExcelDTO dto = new StudentExcelDTO();
//         dto.setUsername(student.getUsername());
//         dto.setPassword(student.getPassword());
//         return dto;
//     }

//     public Student toStudentexel(StudentExcelDTO dto) {
//         if (dto == null) return null;

//         Student student = new Student();
//         student.setUsername(dto.getUsername());
//         student.setPassword(dto.getPassword());
//         return student;
//     }

//     public List<StudentDTO> toStudentDTOList(List<Student> students) {
//         if (students == null) return null;
//         return students.stream().map(this::toStudentDto).collect(Collectors.toList());
//     }

//     public List<Student> toStudentList(List<StudentDTO> dtos) {
//         if (dtos == null) return null;
//         return dtos.stream().map(this::toStudent).collect(Collectors.toList());
//     }

//     public List<Student> toStudentListFromExcelDTO(List<StudentExcelDTO> dtos) {
//         if (dtos == null) return null;
//         return dtos.stream().map(this::toStudentexel).collect(Collectors.toList());
//     }

//     public StudentSummaryDTO toStudentSummaryDto(Student student) {
//         if (student == null) return null;
//         StudentSummaryDTO dto = new StudentSummaryDTO();
//         dto.setStudentId(student.getStudentId());
//         dto.setUsername(student.getUsername());
//         dto.setStudentName(student.getStudentName());
//         dto.setContactNumber(student.getContactNumber());
//         dto.setEmail(student.getEmail());

       

//         return dto;
//     }

//     public List<StudentSummaryDTO> toStudentSummaryDTOList(List<Student> students) {
//         if (students == null) return null;
//         return students.stream().map(this::toStudentSummaryDto).collect(Collectors.toList());
//     }



//     public RecruiterDTO toRecruiterDTO(Recruiter recruiter) {
//         if (recruiter == null) {
//             return null;
//         }

//         RecruiterDTO dto = new RecruiterDTO();
//         dto.setRecruiterId(recruiter.getRecruiterId());
//         dto.setCompanyName(recruiter.getCompanyName());
//         dto.setJobRole(recruiter.getJobRole());
//         dto.setJobDescription(recruiter.getJobDescription());
//         dto.setActive(recruiter.isActive());
//         dto.setDeadline(recruiter.getDeadline());
//         dto.setCompanyLocation(recruiter.getCompanyLocation());
//         dto.setCriteria(recruiter.getCriteria());
//         dto.setIndustryType(recruiter.getIndustryType());
//         dto.setCreatedAt(recruiter.getCreatedAt());
//         dto.setUpdatedAt(recruiter.getUpdatedAt());

//         return dto;
//     }

//     // Convert RecruiterDTO to Recruiter
//     public Recruiter toRecruiter(RecruiterDTO dto) {
//         if (dto == null) {
//             return null;
//         }

//         Recruiter recruiter = new Recruiter();
//         recruiter.setRecruiterId(dto.getRecruiterId());
//         recruiter.setCompanyName(dto.getCompanyName());
//         recruiter.setJobRole(dto.getJobRole());
//         recruiter.setJobDescription(dto.getJobDescription());
//         recruiter.setActive(dto.isActive());
//         recruiter.setDeadline(dto.getDeadline());
//         recruiter.setCompanyLocation(dto.getCompanyLocation());
//         recruiter.setCriteria(dto.getCriteria());
//         recruiter.setIndustryType(dto.getIndustryType());
//         recruiter.setCreatedAt(dto.getCreatedAt());
//         recruiter.setUpdatedAt(dto.getUpdatedAt());

//         return recruiter;
//     }

//     // Convert List<Recruiter> to List<RecruiterDTO>
//     public List<RecruiterDTO> toRecruiterDTOList(List<Recruiter> recruiters) {
//         if (recruiters == null) {
//             return null;
//         }
//         return recruiters.stream()
//             .map(this::toRecruiterDTO)
//             .collect(Collectors.toList());
//     }

//     // Convert List<RecruiterDTO> to List<Recruiter>
//     public List<Recruiter> toRecruiterList(List<RecruiterDTO> dtos) {
//         if (dtos == null) {
//             return null;
//         }
//         return dtos.stream()
//             .map(this::toRecruiter)
//             .collect(Collectors.toList());
//     }
// }

package com.tnp.tnpbackend.utils;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.tnp.tnpbackend.dto.RecruiterDTO;
import com.tnp.tnpbackend.dto.StudentDTO;
import com.tnp.tnpbackend.dto.StudentExcelDTO;
import com.tnp.tnpbackend.dto.StudentSummaryDTO;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Student;

@Component
public class DTOMapper {

    public StudentDTO toStudentDto(Student student) {
        StudentDTO studDto = new StudentDTO();
        if (student == null) return null;
        studDto.setStudentId(student.getStudentId());
        studDto.setStudentName(student.getStudentName());
        studDto.setUsername(student.getUsername());
        studDto.setPassword(student.getPassword());
        studDto.setEmail(student.getEmail());
        studDto.setCgpa(student.getCgpa());
        studDto.setDepartment(student.getDepartment());
        studDto.setSkills(student.getSkills());
        studDto.setResumeURL(student.getResumeURL());
        studDto.setProfileImageURL(student.getProfileImageURL());
        studDto.setAcademicYear(student.getAcademicYear());
        studDto.setBacklogs(student.getBacklogs());
        studDto.setGraduationYear(student.getGraduationYear());
        studDto.setContactNumber(student.getContactNumber());
        studDto.setTenMarks(student.getTenMarks());
        studDto.setHigherSecondaryMarks(student.getHigherSecondaryMarks());
        studDto.setStudentType(student.getStudentType());
        studDto.setCreatedAt(DateTimeConverter.convertToIST(student.getCreatedAt()));
        studDto.setUpdatedAt(DateTimeConverter.convertToIST(student.getUpdatedAt()));
        studDto.setRole(student.getRole());
        return studDto;
    }

    public Student toStudent(StudentDTO dto) {
        Student stud = new Student();
        if (dto == null) return null;
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
        stud.setProfileImageURL(dto.getProfileImageURL());
        stud.setBacklogs(dto.getBacklogs());
        stud.setGraduationYear(dto.getGraduationYear());
        stud.setContactNumber(dto.getContactNumber());
        stud.setTenMarks(dto.getTenMarks());
        stud.setHigherSecondaryMarks(dto.getHigherSecondaryMarks());
        stud.setStudentType(dto.getStudentType());
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

    public RecruiterDTO toRecruiterDTO(Recruiter recruiter) {
        if (recruiter == null) return null;
        RecruiterDTO dto = new RecruiterDTO();
        dto.setRecruiterId(recruiter.getRecruiterId());
        dto.setCompanyName(recruiter.getCompanyName());
        dto.setJobRole(recruiter.getJobRole());
        dto.setJobDescription(recruiter.getJobDescription());
        dto.setActive(recruiter.isActive());
        dto.setDeadline(recruiter.getDeadline());
        dto.setCompanyLocation(recruiter.getCompanyLocation());
        dto.setCriteria(recruiter.getCriteria());
        dto.setIndustryType(recruiter.getIndustryType());
        dto.setCreatedAt(recruiter.getCreatedAt());
        dto.setUpdatedAt(recruiter.getUpdatedAt());
        return dto;
    }

    public Recruiter toRecruiter(RecruiterDTO dto) {
        if (dto == null) return null;
        Recruiter recruiter = new Recruiter();
        recruiter.setRecruiterId(dto.getRecruiterId());
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setJobRole(dto.getJobRole());
        recruiter.setJobDescription(dto.getJobDescription());
        recruiter.setActive(dto.isActive());
        recruiter.setDeadline(dto.getDeadline());
        recruiter.setCompanyLocation(dto.getCompanyLocation());
        recruiter.setCriteria(dto.getCriteria());
        recruiter.setIndustryType(dto.getIndustryType());
        recruiter.setCreatedAt(dto.getCreatedAt());
        recruiter.setUpdatedAt(dto.getUpdatedAt());
        return recruiter;
    }

    public List<RecruiterDTO> toRecruiterDTOList(List<Recruiter> recruiters) {
        if (recruiters == null) return null;
        return recruiters.stream().map(this::toRecruiterDTO).collect(Collectors.toList());
    }

    public List<Recruiter> toRecruiterList(List<RecruiterDTO> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(this::toRecruiter).collect(Collectors.toList());
    }
}