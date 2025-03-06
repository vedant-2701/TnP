package com.tnp.tnpbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.Student;


@Repository
public interface StudentRepository extends MongoRepository<Student, Integer> {

    
}
