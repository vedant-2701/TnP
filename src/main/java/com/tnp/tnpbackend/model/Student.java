package com.tnp.tnpbackend.model;

import java.time.LocalDate;
import java.util.List;


import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Document(collation = "student")

public class Student {

    @Id
    @GeneratedValue()
    private int studentId;
    private String studentName;
    private String userName;
    private String password;
    private String email;
    private double cgpa;
    private Department department;
    private List<String> skills;
    private String resumeURL;
    private AcademicYear academicYear;
    private int backlogs;
    private int graduationYear;
    private String contactNumber;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    public Student() {
    }

    public Student(int studentId, String studentName, String userName, String password, String email, double cGPA,
            Department department, List<String> skills, String resumeURL, AcademicYear academicYear, int backlogs,
            int graduationYear, String contactNumber, LocalDate createdAt, LocalDate updatedAt) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.cgpa = cGPA;
        this.department = department;
        this.skills = skills;
        this.resumeURL = resumeURL;
        this.academicYear = academicYear;
        this.backlogs = backlogs;
        this.graduationYear = graduationYear;
        this.contactNumber = contactNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getCGPA() {
        return this.cgpa;
    }

    public void setCGPA(double cGPA) {
        this.cgpa = cGPA;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getResumeURL() {
        return resumeURL;
    }

    public void setResumeURL(String resumeURL) {
        this.resumeURL = resumeURL;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public int getBacklogs() {
        return backlogs;
    }

    public void setBacklogs(int backlogs) {
        this.backlogs = backlogs;
    }

    public int getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(int graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Student [studentId=" + studentId + ", studentName=" + studentName + ", userName=" + userName
                + ", password=" + password + ", email=" + email + ", cgpa=" + cgpa + ", department=" + department
                + ", skills=" + skills + ", resumeURL=" + resumeURL + ", academicYear=" + academicYear + ", backlogs="
                + backlogs + ", graduationYear=" + graduationYear + ", contactNumber=" + contactNumber + ", createdAt="
                + createdAt + ", updatedAt=" + updatedAt + "]";
    }

}
