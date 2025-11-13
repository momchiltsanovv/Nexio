package com.app.nexio.user.service;

import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;
import com.app.nexio.user.repository.UserRepository;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class UserInit implements ApplicationRunner {

    private final UserService userService;
    private final UserProperties userProperties;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final WishlistService wishlistService;

    @Autowired
    public UserInit(UserService userService, UserProperties userProperties,
                    PasswordEncoder passwordEncoder, UserRepository userRepository,
                    WishlistService wishlistService) {
        this.userService = userService;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.wishlistService = wishlistService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> users = userService.getAllUsers();

        boolean defaultUserDoesNotExist =
                users.stream().noneMatch(user -> user.getUsername()
                                                     .equals(userProperties.getAdminUser().getUsername()));

        if (defaultUserDoesNotExist) {
            User user = User.builder()
                            .username(userProperties.getAdminUser().getUsername())
                            .role(userProperties.getAdminUser()
                                                .getUserRole())
                            .activeAccount(userProperties.getAdminUser()
                                                         .isActiveByDefault())
                            .email(userProperties.getAdminUser().getEmail())
                            .password(passwordEncoder.encode(userProperties.getAdminUser().getPassword()))
                            .build();

            wishlistService.initializeWishlist(user);
            userRepository.save(user);
        }
    }
}
