package com.tnp.tnpbackend.service;

import java.util.List;


import com.tnp.tnpbackend.model.Student;

public interface AdminExcelService {
    public void save(List<Student> students);

    public List<Student> getAllStudents();
}
