package com.tnp.tnpbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;

@Service
public class StudentService {


    @Autowired
    private StudentRepository studentRepository;
    

    public Student addStudent(Student student){

        return studentRepository.save(student);
    }


}
