package com.svalero.ShareWay.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "name is mandatory")
    @Column(nullable = false)
    private String name;
    @Email(message = "email format is not valid")
    @NotBlank(message = "email is mandatory")
    @Column(nullable = false, unique = true)
    private String email;
    @NotBlank(message = "phone is mandatory")
    @Pattern(regexp = "^\\d+$", message = "phone must be numbers")
    @Size(min = 9, message = "phone must have at least 9 numbers")
    @Column(nullable = false)
    private String phone;
    @NotNull(message = "registrationDate is mandatory")
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;
    @Min(value = 0, message = "Min 0")
    @Max(value = 5, message = "Max 5")
    @Column(name = "stars")
    private Integer stars;
    @Column(nullable = false)
    private Boolean verified = false;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role = "USER";

    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"reservations"})
    private User user;
}