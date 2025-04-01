package com.tnp.tnpbackend.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.repository.StudentRecruiterRelationRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.PlacementService;

@Service
public class PlacementServiceImpl implements PlacementService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private StudentRecruiterRelationRepository relationRepository;

    public void applyToRecruiter(String studentId, String recruiterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        StudentRecruiterRelation relation = new StudentRecruiterRelation();
        relation.setStudent(student);
        relation.setRecruiter(recruiter);
        relation.setStatus("APPLIED");
        relation.setAppliedAt(LocalDateTime.now());

        relationRepository.save(relation);
    }

    public List<Student> getStudentsForRecruiter(String recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return relationRepository.findByRecruiter(recruiter)
                .stream()
                .map(StudentRecruiterRelation::getStudent)
                .collect(Collectors.toList());
    }
}
