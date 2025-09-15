package com.app.nexio.user.service;

import com.app.nexio.user.dto.RegisterRequestDto;
import com.app.nexio.user.model.User;

import java.util.UUID;

public interface UserService {

    User register(RegisterRequestDto registerRequest);

    void switchStatus(UUID userId);

    void switchRole(UUID userId);

    void editUserDetails();//Todo figure out parameters

}
