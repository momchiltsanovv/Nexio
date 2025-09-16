package com.app.nexio.user.service;

import com.app.nexio.exception.UsernameTakenException;
import com.app.nexio.exception.IncorrectUsernameOrPasswordException;
import com.app.nexio.user.dto.LoginRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;
import com.app.nexio.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully";
    public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
    public static final String INVALID_USERNAME_OR_PASSWORD = "Invalid username or password";
    private final UserRepository userRepository;
    private final UserProperties userProperties;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserProperties userProperties, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(loginRequest.usernameOrEmail());

        if (optionalUser.isEmpty()) {
            throw new IncorrectUsernameOrPasswordException(INVALID_USERNAME_OR_PASSWORD);
        }

        String rawPassword = loginRequest.password();
        String hashedPassword = optionalUser.get().getPassword();

        if(!passwordEncoder.matches(rawPassword, hashedPassword)) {
            throw new IncorrectUsernameOrPasswordException(INVALID_USERNAME_OR_PASSWORD);
        }

        return optionalUser.get();
    }


    @Override
    public User register(RegisterRequest registerRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(registerRequest.username());

        if (optionalUser.isPresent()) {
            throw new UsernameTakenException(USERNAME_ALREADY_TAKEN.formatted(registerRequest.username()));
        }

        User user = userRepository.save(initializeUserFromRequest(registerRequest));

        log.info(USER_REGISTERED_SUCCESSFULLY);

        return user;

    }

    private User initializeUserFromRequest(RegisterRequest registerRequest) {
        return User.builder()
                   .username(registerRequest.username())
                   .firstName(registerRequest.firstName())
                   .lastName(registerRequest.lastName())
                   .role(userProperties.getUserRole())
                   .active(userProperties.isActiveByDefault())
                   .university(registerRequest.university())
                   .email(registerRequest.email())
                   .password(getEncodedPassword(registerRequest))
                   .build();
    }

    private String getEncodedPassword(RegisterRequest registerRequest) {
        return passwordEncoder.encode(registerRequest.password());
    }


    @Override
    public void switchStatus(UUID userId) {

    }

    @Override
    public void switchRole(UUID userId) {

    }

    @Override
    public void editUserDetails() {

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
