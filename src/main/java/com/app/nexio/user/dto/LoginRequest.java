package com.app.nexio.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        @NotBlank(message = "Username is required")
        String usernameOrEmail,

        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$",
                message = "Password must contain at least 1 uppercase letter, 1 digit, 1 special character, and be at least 8 characters long"
        )
        String password
) {
}
