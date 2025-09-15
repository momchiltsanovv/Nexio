package com.app.nexio.user.service;

import com.app.nexio.exception.UsernameTakenException;
import com.app.nexio.user.dto.RegisterRequestDto;
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

    private final UserRepository userRepository;
    private final UserProperties userProperties;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserProperties userProperties, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequestDto registerRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(registerRequest.username());

        if (optionalUser.isPresent()) {
            throw new UsernameTakenException("Username %s is already taken".formatted(registerRequest.username()));
        }

        User user = userRepository.save(buildUserFromRequest(registerRequest));

        log.info("User registered successfully");

        return user;

    }

    private User buildUserFromRequest(RegisterRequestDto registerRequest) {
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

    private String getEncodedPassword(RegisterRequestDto registerRequest) {
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
