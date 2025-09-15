package com.app.nexio.user.dto;


import com.app.nexio.user.model.University;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "username is required")
    @Size(min = 3, message = "username must be at least 3 characters")
    private String username;

    @Email(message = "please provide a valid email address")
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "required to select university")
    //TODO validate university with custom @validator
    private University university;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$",
             message = "Password must contains at least 1 upper case letter, " +
                     "1 digit, " +
                     "1 special character" +
                     "and 8 minimum length")
    private String password;




}
