package com.svalero.ShareWay.controller;

import com.svalero.ShareWay.domain.Reservation;
import com.svalero.ShareWay.service.ReservationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    private final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // GET /reservations
    @GetMapping
    public List<Reservation> getAll() {
        logger.info("GET /reservation");
        return reservationService.findAll();
    }

    // GET /reservations/{id}
    @GetMapping("/{id}")
    public Reservation get(@PathVariable Long id) {
        logger.info("GET /reservation/id");
        return reservationService.findById(id);
    }

    // POST /reservations
    @PostMapping
    public Reservation create(@RequestBody @Valid Reservation reservation) {
        return reservationService.add(reservation);
    }

    // PUT /reservations/{id}
    @PutMapping("/{id}")
    public Reservation update(@RequestBody @Valid Reservation reservation, @PathVariable Long id) {
        return reservationService.modify(id, reservation);
    }

    // DELETE /reservations/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reservationService.delete(id);
    }
}
