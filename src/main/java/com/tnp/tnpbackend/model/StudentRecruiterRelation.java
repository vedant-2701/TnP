package com.tnp.tnpbackend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "student_recruiter_relations")
public class StudentRecruiterRelation {
    @Id
    private String id;
    @DBRef
    private Student student;
    @DBRef
    private Recruiter recruiter;
    private String status; // e.g., "APPLIED", "INTERVIEWED", "HIRED"
    private LocalDateTime appliedAt;
}
