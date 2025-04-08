package com.tnp.tnpbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.Student;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {

    Optional<Student> findByUsername(String username);

    Boolean existsByUsername(String username);

    List<Student> findByDepartment(String department);

    @Query("{ 'department': ?0, '_id': ?1 }")
    Optional<Student> findByDepartmentAndStudentId(String department, String studentId);

    @Query("{ 'graduationYear': ?0 }")
    List<Student> findByGraduationYear(String graduationYear);

}

// "nested_object_keys.tag": { $all: ["some_tag", "some_other_tag"] }