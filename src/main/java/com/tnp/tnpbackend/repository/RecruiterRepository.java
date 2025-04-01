package com.tnp.tnpbackend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.Recruiter;

@Repository
public interface RecruiterRepository extends MongoRepository<Recruiter, String>{
}