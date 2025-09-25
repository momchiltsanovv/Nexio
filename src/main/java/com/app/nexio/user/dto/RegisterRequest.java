package com.app.nexio.user.dto;

import com.app.nexio.user.model.University;
import jakarta.validation.constraints.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotBlank(message = "Username is required")
        @Size(min = 3, message = "Username must be at least 3 characters")
        private String username;

        @Email(message = "Please provide a valid email address")
        @NotBlank(message = "Email is required")
        private String email;

        @NotNull(message = "University is required")
        private University university;

        @NotBlank(message = "Password is required")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$",
                message = "Password must contain at least 1 uppercase letter, 1 digit, 1 special character, and be at least 8 characters long"
        )
        private String password;

}
