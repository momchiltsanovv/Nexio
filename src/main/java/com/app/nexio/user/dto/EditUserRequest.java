package com.app.nexio.user.dto;

import com.app.nexio.user.model.University;
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

    @Size(min = 2)
   private String firstName;

    @Size(min = 2)
   private String lastName;

    @URL(message = "Instagram URL must be valid if provided")
    private String instagramURL;

    @URL(message = "LinkedIn URL must be valid if provided")
    private String linkedinURL;

    private University university;

    @Size(max = 255, message = "Major name cant be more than 255 characters")
    private String major;

    @Max(value = 2030, message = "Graduation year must be before 2030 if provided")
    private Integer graduationYear;


    public static EditUserRequest fromUser(User user) {

        EditUserRequest editRequest = new EditUserRequest();

        editRequest.setProfilePictureURL(user.getProfilePictureURL());
        editRequest.setFirstName(user.getFirstName());
        editRequest.setLastName(user.getLastName());
        editRequest.setInstagramURL(user.getInstagramURL());
        editRequest.setUniversity(user.getUniversity());
        editRequest.setLinkedinURL(user.getLinkedinURL());
        editRequest.setMajor(user.getMajor());
        editRequest.setGraduationYear(user.getGraduationYear());

        return editRequest;
    }
}
