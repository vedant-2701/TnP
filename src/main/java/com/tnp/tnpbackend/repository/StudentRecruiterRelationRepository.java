package com.tnp.tnpbackend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;

@Repository
public interface StudentRecruiterRelationRepository extends MongoRepository<StudentRecruiterRelation, String> {
    List<StudentRecruiterRelation> findByStudent(Student student);
    List<StudentRecruiterRelation> findByRecruiter(Recruiter recruiter);
}