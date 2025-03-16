package com.tnp.tnpbackend.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection  = "academicYear")
public class AcademicYear {

    @Id
    private String academicYearId;
    private String yearName;
    private boolean isActive;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    public AcademicYear() {
    }

   
    public AcademicYear(String academicYearId, String yearName, boolean isActive,LocalDate createdAt,LocalDate updatedAt) {
        this.academicYearId = academicYearId;
        this.yearName = yearName;
        this.isActive = isActive;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }

    public void setAcademicYearId(String academicYearId) {
        this.academicYearId = academicYearId;
    }

    public String getYearName() {
        return yearName;
    }

    public void setYearName(String yearName) {
        this.yearName = yearName;
    }
    public String getAcademicYearId() {
        return academicYearId;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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
        return "AcademicYear [academicYearId=" + academicYearId + ", yearName=" + yearName + ", isActive=" + isActive
                + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }


   

}
