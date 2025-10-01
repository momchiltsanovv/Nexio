package com.app.nexio.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditUserRequest {


        private String profilePictureURL;

        @URL(message = "Instagram URL must be valid if provided")
        String instagramURL;

        @URL(message = "LinkedIn URL must be valid if provided")
        String linkedinURL;

        @Size(max = 255, message = "Major name cant be more than 255 characters")
        String major;

        @Max(value = 2030, message = "Graduation year must be before 2030 if provided")
        Integer graduationYear;
}
