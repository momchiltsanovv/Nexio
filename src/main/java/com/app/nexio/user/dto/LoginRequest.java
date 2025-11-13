package com.app.nexio.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Username or email is required")
    String usernameOrEmail;

    @NotBlank(message = "Password is required")
    String password;
}
