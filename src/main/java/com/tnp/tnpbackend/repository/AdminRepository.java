package com.tnp.tnpbackend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tnp.tnpbackend.model.Admin;

public interface AdminRepository extends MongoRepository<Admin, String>{
    Optional<Admin> findByUsername(String username);

    Boolean existsByUsername(String username);
}
