package com.tnp.tnpbackend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.tnp.tnpbackend.model.TPOHead;

@Repository
public interface TnpHeadRepository extends MongoRepository<TPOHead,String>{
    Optional<TPOHead> findByUsername(String username);

    Boolean existsByUsername(String username);
}
