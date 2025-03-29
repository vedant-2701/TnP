package com.tnp.tnpbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.Student;


@Repository
public interface StudentRepository extends MongoRepository<Student, String> {

    Optional<Student> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<Student> findByDepartment(String department);

    
}
