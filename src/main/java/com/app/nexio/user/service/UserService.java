package com.app.nexio.user.service;

import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;

import java.util.UUID;

public interface UserService {

    User register(RegisterRequest registerRequest);

    void switchStatus(UUID userId);

    void switchRole(UUID userId);

    void editUserDetails();//Todo figure out parameters

}
