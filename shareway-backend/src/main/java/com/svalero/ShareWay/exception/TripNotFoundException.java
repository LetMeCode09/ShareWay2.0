package com.svalero.ShareWay.exception;

public class TripNotFoundException extends RuntimeException {

    public TripNotFoundException(Long id) {
        super("Trip not found with id: " + id);
    }

    public TripNotFoundException() {
        super("Trip not found");
    }
}