package com.svalero.ShareWay.repository;

import com.svalero.ShareWay.domain.Reservation;
import com.svalero.ShareWay.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    List<User> findAll();
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    //Buscar por nombre
    List<User> findByNameContainingIgnoreCase(String name);
}