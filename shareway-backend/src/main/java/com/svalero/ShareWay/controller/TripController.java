package com.svalero.ShareWay.controller;

import com.svalero.ShareWay.domain.Trip;
import com.svalero.ShareWay.service.TripService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    private final Logger logger = LoggerFactory.getLogger(TripController.class);

    // GET /trips
    @GetMapping
    public ResponseEntity<List<Trip>> getAll() {
        logger.info("GET /trips");
        return new ResponseEntity<>(tripService.findAll(), HttpStatus.OK);
    }

    // GET /trips/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Trip> get(@PathVariable long id) {
        logger.info("GET /trips/{}", id);
        return new ResponseEntity<>(tripService.findById(id), HttpStatus.OK);
    }

    // POST /trips
    @PostMapping
    public ResponseEntity<Trip> addTrip(@Valid @RequestBody Trip trip) {
        logger.info("POST /trips");
        return new ResponseEntity<>(tripService.add(trip), HttpStatus.CREATED);
    }

    // PUT /trips/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Trip> modifyTrip(@PathVariable long id, @Valid @RequestBody Trip trip) {
        logger.info("PUT /trips/{}", id);
        return new ResponseEntity<>(tripService.modify(id, trip), HttpStatus.OK);
    }

    // DELETE /trips/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable long id) {
        logger.info("DELETE /trips/{}", id);
        tripService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}