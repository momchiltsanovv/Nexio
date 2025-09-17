package com.app.nexio.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;


public record EditRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @URL(message = "Instagram URL must be valid if provided")
        String instagramURL,

        @URL(message = "LinkedIn URL must be valid if provided")
        String linkedinURL,

        String major,

        @Max(value = 2030, message = "Graduation year must be before 2030 if provided")
        Integer graduationYear
) {
}
