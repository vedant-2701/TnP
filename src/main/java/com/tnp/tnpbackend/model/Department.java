package com.tnp.tnpbackend.model;

import java.time.LocalDate;

public class Department {

    private int departmentId;
    private String departmentName;
    private TPODeptHead tpoDeptHead;
    private long totalStudents;
    private LocalDate createdAt;
    private LocalDate updatedAt;

    public Department() {
    }

    public Department(int departmentId, String departmentName, TPODeptHead tpoDeptHead, long totalStudents,LocalDate createdAt,LocalDate updatedAt) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.tpoDeptHead = tpoDeptHead;
        this.totalStudents = totalStudents;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public TPODeptHead getTpoDeptHead() {
        return tpoDeptHead;
    }

    public void setTpoDeptHead(TPODeptHead tpoDeptHead) {
        this.tpoDeptHead = tpoDeptHead;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
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
        return "Department [departmentId=" + departmentId + ", departmentName=" + departmentName + ", tpoDeptHead="
                + tpoDeptHead + ", totalStudents=" + totalStudents + ", createdAt=" + createdAt + ", updatedAt="
                + updatedAt + "]";
    }

   

}
