package com.tnp.tnpbackend.service;

import java.util.List;
import java.util.Map;

public interface AdminService {

    // Pie chart - status wise applied, interviewed, hired
    Map<String, Long> getApplicationStatusAnalytics();

    // Bar chart - number of students per department
    Map<String, Long> getStudentsByDepartmentAnalytics();

    // Placement Success Rate by Department
    Map<String, Double> getPlacementSuccessRateAnalytics();

    // Top recruiters based on number of students hired
    List<Map<String, Object>> getTopRecruitersAnalytics();

    // Number of applications (APPLIED, INTERVIEWED, HIRED) per recruiter/company
    Map<String, Map<String, Long>> getRecruiterApplicationAnalytics();
}