package com.tnp.tnpbackend.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.helper.AdminHelper;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.AdminExcelService;

@Service
public class AdminExcelServiceImpl implements AdminExcelService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public void save(List<Student> students) {
        try {
            // List<Student> students = adminHelper.convertExcelToListOfFacultyt(file.getInputStream());
            System.out.println(students);
            this.studentRepository.saveAll(students);
        } catch (Exception e) {

        }
    }

    @Override
    public List<Student> getAllStudents() {
        return null;
    }

}
