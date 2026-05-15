package com.svalero.ShareWay.repository;

import com.svalero.ShareWay.domain.Trip;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends CrudRepository<Trip, Long> {

    List<Trip> findAll();


}