package com.tnp.tnpbackend.model;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class RecruiterCriteria {
    private Double minCgpa;
    private Double minTenMarks;
    private Double minHigherSecondaryMarks;
    private List<String> requiredSkills;
    private String department;

    public RecruiterCriteria(Map<String, String> criteria) {
        if (criteria != null) {
            this.minCgpa = criteria.containsKey("cgpa") ? Double.parseDouble(criteria.get("cgpa")) : null;
            this.minTenMarks = criteria.containsKey("tenMarks") ? Double.parseDouble(criteria.get("tenMarks")) : null;
            this.minHigherSecondaryMarks = criteria.containsKey("higherSecondaryMarks") 
                ? Double.parseDouble(criteria.get("higherSecondaryMarks")) : null;
            this.requiredSkills = criteria.containsKey("skills") ? List.of(criteria.get("skills").split(",")) : null;
        }
        //this.department = departmentFilter;
    }

    public boolean isStudentEligible(Student student) {
        if (minCgpa != null && (student.getCgpa() < minCgpa)) return false;
        if (minTenMarks != null && (student.getTenMarks() < minTenMarks)) return false;
        if (minHigherSecondaryMarks != null && (student.getHigherSecondaryMarks() < minHigherSecondaryMarks)) return false;
        if (requiredSkills != null && student.getSkills() != null) {
            for (String skill : requiredSkills) {
                if (!student.getSkills().contains(skill.trim())) return false;
            }
        }
        if (department != null && !student.getDepartment().equalsIgnoreCase(department)) return false;
        return true;
    }
}