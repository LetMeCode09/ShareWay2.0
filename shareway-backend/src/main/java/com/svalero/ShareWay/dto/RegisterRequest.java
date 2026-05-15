package com.svalero.ShareWay.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "name is mandatory")
    private String name;

    @Email(message = "email format is not valid")
    @NotBlank(message = "email is mandatory")
    private String email;

    @NotBlank(message = "phone is mandatory")
    @Pattern(regexp = "^\\d+$", message = "phone must be numbers")
    @Size(min = 9, message = "phone must have at least 9 numbers")
    private String phone;

    @NotBlank(message = "password is mandatory")
    @Size(min = 6, message = "password must have at least 6 characters")
    private String password;
}