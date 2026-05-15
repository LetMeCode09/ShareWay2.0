package com.svalero.ShareWay.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "Origin is mandatory")
    @Column
    private String origin;
    @NotNull(message = "Destination is mandatory")
    @Column
    private String destination;
    @NotNull(message = "Date and time are mandatory")
    @Column(name= "date_time")
    private LocalDate dateTime;
    @Column(name= "transport_types")
    private String transportTypes;
    @Min(value=1)
    @Column(name= "available_seats")
    private Integer availableSeats;
    @Min(value = 0, message = "price cannot be negative")
    @Column(name= "prices")
    private Integer price;
    @Column
    private Boolean full;

    @JsonIgnoreProperties({"reservations"})
    @OneToMany (mappedBy = "trip")
    @JsonBackReference
    private List<Reservation> reservations;
}