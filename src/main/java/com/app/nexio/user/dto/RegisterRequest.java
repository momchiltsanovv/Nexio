package com.app.nexio.user.dto;

import com.app.nexio.user.model.University;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record RegisterRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotBlank(message = "Username is required")
        @Size(min = 3, message = "Username must be at least 3 characters")
        String username,

        @Email(message = "Please provide a valid email address")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank
        University university,

        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$",
                message = "Password must contain at least 1 uppercase letter, 1 digit, 1 special character, and be at least 8 characters long"
        )
        String password
) {
}
