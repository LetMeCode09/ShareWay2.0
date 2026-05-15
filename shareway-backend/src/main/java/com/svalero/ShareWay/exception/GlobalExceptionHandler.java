package com.svalero.ShareWay.exception;

import com.svalero.ShareWay.controller.ReservationController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private final Logger logger = LoggerFactory.getLogger(ReservationController.class);
    // USER NOT FOUND → 404
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleUserNotFound(UserNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("error", "User not found");
        error.put("message", ex.getMessage());
        logger.error("User not found");
        return error;
    }

    // ResponseStatusException → respeta el status (400, 404, etc.)
    @ExceptionHandler(ResponseStatusException.class)
    public Map<String, Object> handleResponseStatus(ResponseStatusException ex) {
        HttpStatus status = (HttpStatus) ex.getStatusCode();

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", ex.getReason() != null ? ex.getReason() : ex.getMessage());
        logger.error("Response Status");
        return error;
    }

    // ERRORES GENERALES → 500
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleGeneral(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Internal error");
        error.put("message", ex.getMessage());
        logger.error("Internal Error");
        return error;
    }
}