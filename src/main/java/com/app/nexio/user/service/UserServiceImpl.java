package com.app.nexio.user.service;

import com.app.nexio.exception.UserDoesNotExistException;
import com.app.nexio.exception.UsernameTakenException;
import com.app.nexio.exception.IncorrectUsernameOrPasswordException;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.dto.LoginRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import com.app.nexio.user.property.UserProperties;
import com.app.nexio.user.repository.UserRepository;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully";
    public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
    public static final String INVALID_USERNAME_OR_PASSWORD = "Invalid username or password";
    public static final UserRole ADMIN = UserRole.ADMIN;
    public static final UserRole USER = UserRole.USER;
    private static final String USER_LOGIN_SUCCESSFULLY = "User logged in successfully";
    private final UserRepository userRepository;
    private static final String USER_UPDATED_SUCCESSFULLY = "User info updated successfully ";
    private final UserProperties userProperties;
    private final PasswordEncoder passwordEncoder;
    private final WishlistService wishlistService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           UserProperties userProperties,
                           PasswordEncoder passwordEncoder,
                           WishlistService wishlistService) {
        this.userRepository = userRepository;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
        this.wishlistService = wishlistService;
    }

    @Override
    public User login(LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail());

        if (optionalUser.isEmpty()) {
            throw new IncorrectUsernameOrPasswordException(INVALID_USERNAME_OR_PASSWORD);
        }

        String rawPassword = loginRequest.getPassword();
        String hashedPassword = optionalUser.get().getPassword();

        if (!passwordEncoder.matches(rawPassword, hashedPassword)) {
            throw new IncorrectUsernameOrPasswordException(INVALID_USERNAME_OR_PASSWORD);
        }

        log.info(USER_LOGIN_SUCCESSFULLY);

        return optionalUser.get();
    }


    @Override
    @Transactional
    public void register(RegisterRequest registerRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(registerRequest.getUsername());

        if (optionalUser.isPresent()) {
            throw new UsernameTakenException(USERNAME_ALREADY_TAKEN.formatted(registerRequest.getUsername()));
        }

        User user = userRepository.save(initializeUserFromRequest(registerRequest));
        wishlistService.initializeWishlist(user);

        log.info(USER_REGISTERED_SUCCESSFULLY);

    }

    private User initializeUserFromRequest(RegisterRequest registerRequest) {
        return User.builder()
                   .username(registerRequest.getUsername())
                   .firstName(registerRequest.getFirstName())
                   .lastName(registerRequest.getLastName())
                   .role(userProperties.getDefaultUser()
                                       .getUserRole())
                   .activeAccount(userProperties.getDefaultUser()
                                                .isActiveByDefault())
                   .university(registerRequest.getUniversity())
                   .email(registerRequest.getEmail())
                   .password(getEncodedPassword(registerRequest))
                   .build();
    }

    private String getEncodedPassword(RegisterRequest registerRequest) {
        return passwordEncoder.encode(registerRequest.getPassword());
    }


    @Override
    public void switchStatus(UUID userId) {
        User user = userRepository.getUserById(userId);
        user.setActiveAccount(!user.isActiveAccount());
        userRepository.save(user);
    }

    @Override
    public void switchRole(UUID userId) {
        User user = userRepository.getUserById(userId);
        user.setRole(user.getRole() == ADMIN ? USER : ADMIN);
        userRepository.save(user);
    }

    @Override
    public void editUserDetails(UUID userid, EditUserRequest editRequest) {
        User user = userRepository.getUserById(userid);

        user.setInstagramURL(editRequest.getInstagramURL());
        user.setLinkedinURL(editRequest.getLinkedinURL());
        user.setMajor(editRequest.getMajor());
        user.setGraduationYear(editRequest.getGraduationYear());

        userRepository.save(user);

        log.info(USER_UPDATED_SUCCESSFULLY);

    }

    @Override
    public User getById(UUID userId) {
        return userRepository.getUserById(userId);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getAll() {
        return userRepository.getAll();
    }

    @Override
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                             .orElseThrow(() -> new UserDoesNotExistException("User with username: %s does not exist".formatted(username)));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }


}
