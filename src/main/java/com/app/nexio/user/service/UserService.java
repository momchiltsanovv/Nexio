package com.app.nexio.user.service;

import com.app.nexio.user.dto.EditRequest;
import com.app.nexio.user.dto.LoginRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;

import java.util.List;
import java.util.UUID;

public interface UserService {

    User register(RegisterRequest registerRequest);

    void switchStatus(UUID userId);

    void switchRole(UUID userId);

    void editUserDetails(UUID userid, EditRequest editRequest);

    User getById(UUID userId);

    List<User> getAllUsers();

    List<User> getAll();

    User getByUsername(String username);

    User login(LoginRequest loginRequest);
}
