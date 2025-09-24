package com.app.nexio.user.service;

import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;
import jakarta.validation.Valid;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserInit implements ApplicationRunner {

    private final UserService userService;
    private final UserProperties userProperties;

    public UserInit(UserService userService, UserProperties userProperties) {
        this.userService = userService;
        this.userProperties = userProperties;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<User> users = userService.getAll();


        boolean defaultUserDoesNotExist = users.stream()
                                               .noneMatch(user -> user.getUsername()
                                                                      .equals(userProperties.getDefaultUser()
                                                                                            .getUsername()));

        if (defaultUserDoesNotExist) {

            RegisterRequest registerRequest = RegisterRequest.builder()
                                                             .firstName(userProperties.getDefaultUser().getFirstName())
                                                             .lastName(userProperties.getDefaultUser().getLastName())
                                                             .email(userProperties.getDefaultUser().getEmail())
                                                             .university(userProperties.getDefaultUser().getUniversity())
                                                             .username(userProperties.getDefaultUser().getUsername())
                                                             .password(userProperties.getDefaultUser().getPassword())
                                                             .build();
            userService.register(registerRequest);
        }
    }
}