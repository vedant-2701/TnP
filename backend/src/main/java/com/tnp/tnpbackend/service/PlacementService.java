package com.tnp.tnpbackend.service;

import java.util.List;


import com.tnp.tnpbackend.model.Student;

public interface PlacementService {
    public void applyToRecruiter(String studentId, String recruiterId);
    public List<Student> getStudentsForRecruiter(String recruiterId);
    //public Object getMyHistory(String studentId);
}
