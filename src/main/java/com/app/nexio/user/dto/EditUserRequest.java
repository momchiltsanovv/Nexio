package com.app.nexio.user.dto;

import com.app.nexio.user.model.User;
import jakarta.validation.constraints.Max;
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


    public static EditUserRequest fromUser(User user) {

        EditUserRequest editRequest = new EditUserRequest();

        editRequest.setProfilePictureURL(user.getProfilePictureURL());
        editRequest.setInstagramURL(user.getInstagramURL());
        editRequest.setLinkedinURL(user.getLinkedinURL());
        editRequest.setMajor(user.getMajor());
        editRequest.setGraduationYear(user.getGraduationYear());

        return editRequest;
    }
}
