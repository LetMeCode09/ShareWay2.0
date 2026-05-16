package com.svalero.ShareWay.service;

import com.svalero.ShareWay.domain.Trip;
import com.svalero.ShareWay.exception.TripNotFoundException;
import com.svalero.ShareWay.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public List<Trip> findAll() {
        return tripRepository.findAll();
    }

    public Trip findById(long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException(id));
    }

    public Trip add(Trip trip) {
        return tripRepository.save(trip);
    }

    public Trip modify(long id, Trip trip) {
        Trip existingTrip = tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException(id));
        trip.setId(existingTrip.getId());
        return tripRepository.save(trip);
    }

    public void delete(long id) {
        Trip existingTrip = tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException(id));
        tripRepository.delete(existingTrip);
    }
}
