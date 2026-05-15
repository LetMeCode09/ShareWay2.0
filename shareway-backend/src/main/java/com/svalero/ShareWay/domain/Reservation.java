package com.svalero.ShareWay.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Min(value=1)
    @Column(name= "number_of_seats")
    private Integer numberOfSeats;
    @NotNull (message = "date is required")
    @Column(name= "reservation_date")
    private LocalDate reservationDate;
    @Column
    private Boolean confirmed;
    @Column
    private String comment;
    @Min(value = 0, message = "price cannot be negative")
    @Column(name= "total_price")
    private Integer totalPrice;

    @ManyToOne
    @JsonIgnoreProperties("reservation")
    @JoinColumn (name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="trip_id")
    @JsonIgnoreProperties({"reservations"})
    private Trip trip;
}