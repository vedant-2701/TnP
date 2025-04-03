package com.tnp.tnpbackend.model;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.Data;

@Data
public class RecruiterCriteria {
    private Double minCgpa;
    private Double minTenMarks;
    private Double minHigherSecondaryMarks;
    // private List<String> requiredSkills;
    private String department;
    private String academicYear;       // e.g., "TY 2023-24"
    private Integer graduationYear;

    public RecruiterCriteria(Map<String, String> criteria,String jobDescription) {
        if (criteria != null) {
            this.minCgpa = criteria.containsKey("cgpa") ? Double.parseDouble(criteria.get("cgpa")) : null;
            this.minTenMarks = criteria.containsKey("tenMarks") ? Double.parseDouble(criteria.get("tenMarks")) : null;
            this.minHigherSecondaryMarks = criteria.containsKey("higherSecondaryMarks") 
                ? Double.parseDouble(criteria.get("higherSecondaryMarks")) : null;
            // this.requiredSkills = criteria.containsKey("skills") ? List.of(criteria.get("skills").split(",")) : null;
        }
        //this.department = departmentFilter;

        if (jobDescription != null) {
            this.department = parseDepartment(jobDescription);
            this.academicYear = parseAcademicYear(jobDescription);
            this.graduationYear = parseGraduationYear(jobDescription);
        }
    }

    private String parseDepartment(String jobDescription) {
        Pattern pattern = Pattern.compile("requires\\s+(\\w+)\\s+students", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(jobDescription);
        return matcher.find() ? matcher.group(1) : null;
    }
    
    private String parseAcademicYear(String jobDescription) {
        Pattern pattern = Pattern.compile("(TY|SY|FY)\\s+(\\d{4}-\\d{2})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(jobDescription);
        return matcher.find() ? matcher.group(1) + " " + matcher.group(2) : null;
    }

    private Integer parseGraduationYear(String jobDescription) {
        Pattern pattern = Pattern.compile("passout year\\s+(\\d{4})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(jobDescription);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : null;
    }



    public boolean isStudentEligible(Student student) {
        if (minCgpa != null && (student.getCgpa() < minCgpa)) return false;
        if (minTenMarks != null && (student.getTenMarks() < minTenMarks)) return false;
        if (minHigherSecondaryMarks != null && (student.getHigherSecondaryMarks() < minHigherSecondaryMarks)) return false;
        // if (requiredSkills != null && student.getSkills() != null) {
        //     for (String skill : requiredSkills) {
        //         if (!student.getSkills().contains(skill.trim())) return false;
        //     }
        // }
        if (graduationYear != null && !graduationYear.equals(student.getGraduationYear())) return false;

        // Check branch and academic year from jobDescription
        if (department != null && !student.getDepartment().equalsIgnoreCase(department)) return false;
        if (academicYear != null && !academicYear.equals(student.getAcademicYear())) return false;
        return true;
    }
}