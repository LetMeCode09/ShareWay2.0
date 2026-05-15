package com.svalero.ShareWay.service;

import com.svalero.ShareWay.domain.Reservation;
import com.svalero.ShareWay.domain.Trip;
import com.svalero.ShareWay.domain.User;
import com.svalero.ShareWay.repository.ReservationRepository;
import com.svalero.ShareWay.repository.TripRepository;
import com.svalero.ShareWay.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              TripRepository tripRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    public Reservation add(Reservation reservation) {
        attachRelations(reservation);
        return reservationRepository.save(reservation);
    }

    public Reservation modify(Long id, Reservation reservation) {
        Reservation updated = reservationRepository.findById(id).orElse(null);
        if (updated == null) return null;

        updated.setReservationDate(reservation.getReservationDate());
        updated.setConfirmed(reservation.getConfirmed());
        updated.setTotalPrice(reservation.getTotalPrice());
        updated.setNumberOfSeats(reservation.getNumberOfSeats());
        updated.setComment(reservation.getComment()); // ✅ te faltaba

        // ✅ Relaciones: user/trip
        updated.setUser(reservation.getUser());
        updated.setTrip(reservation.getTrip());
        attachRelations(updated);

        return reservationRepository.save(updated);
    }

    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    /**
     * Convierte trip:{id} y user:{id} en entidades gestionadas por JPA,
     * para que se guarden correctamente los FK (trip_id, user_id).
     */
    private void attachRelations(Reservation reservation) {
        // Trip
        if (reservation.getTrip() != null && reservation.getTrip().getId() != null) {
            Long tripId = reservation.getTrip().getId();
            Trip trip = tripRepository.findById(tripId).orElse(null);
            reservation.setTrip(trip);
        } else {
            reservation.setTrip(null);
        }

        // User
        if (reservation.getUser() != null && reservation.getUser().getId() != null) {
            Long userId = reservation.getUser().getId();
            User user = userRepository.findById(userId).orElse(null);
            reservation.setUser(user);
        } else {
            reservation.setUser(null);
        }
    }
}