package com.app.nexio.user.service;

import com.app.nexio.exception.UsernameAlreadyTakenException;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Provider;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Transactional
    public User register(RegisterRequest registerRequest) {

        Optional<User> optionalUser = userRepository.findByUsername(registerRequest.getUsername());

        if (optionalUser.isPresent()) {
            throw new UsernameAlreadyTakenException("Username [%s] already exist.".formatted(registerRequest.getUsername()));
        }

        User user = userRepository.save(initializeNewUser(registerRequest));


        log.info("Successfully create new user account for [%s] and id [%s]".formatted(user.getUsername(),
                                                                                       user.getId()));

        return userRepository.save(user);
    }

    private User initializeNewUser(RegisterRequest registerRequest) {

        return User.builder()
                   .username(registerRequest.getUsername())
                   .password(passwordEncoder.encode(registerRequest.getPassword()))
                   .firstName(registerRequest.getFirstName())
                   .lastName(registerRequest.getLastName())
                   .email(registerRequest.getEmail())
                   .build();
    }

    public User getById(UUID userId) {
        return userRepository.getById(userId);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
