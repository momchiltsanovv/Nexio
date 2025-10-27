package com.app.nexio.user.service;

import com.app.nexio.exception.UserDoesNotExistException;
import com.app.nexio.exception.UsernameTakenException;
import com.app.nexio.security.AuthenticationMetaData;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import com.app.nexio.user.property.UserProperties;
import com.app.nexio.user.repository.UserRepository;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserService implements UserDetailsService {

    public static final String USER_REGISTERED_SUCCESSFULLY = "User registered successfully";
    public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
    public static final UserRole ADMIN = UserRole.ADMIN;
    public static final UserRole USER = UserRole.USER;
    public static final String NO_SUCH_USER_FOUND = "No such user found";
    public static final boolean ACTIVE_ACCOUNT = true;
    private final UserRepository userRepository;
    private static final String USER_UPDATED_SUCCESSFULLY = "User info updated successfully ";
    private final UserProperties userProperties;
    private final PasswordEncoder passwordEncoder;
    private final WishlistService wishlistService;

    @Autowired
    public UserService(UserRepository userRepository,
                       UserProperties userProperties,
                       PasswordEncoder passwordEncoder,
                       WishlistService wishlistService) {
        this.userRepository = userRepository;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
        this.wishlistService = wishlistService;
    }


    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void register(RegisterRequest registerRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(registerRequest.getUsername());

        if (optionalUser.isPresent()) {
            throw new UsernameTakenException(USERNAME_ALREADY_TAKEN.formatted(registerRequest.getUsername()));
        }

        User user = initializeUserFromRequest(registerRequest);
        wishlistService.initializeWishlist(user);
        userRepository.save(user);
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


    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "admins", allEntries = true)
    })
    public void switchStatus(UUID userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserDoesNotExistException(NO_SUCH_USER_FOUND);
        }

        user.get().setActiveAccount(!user.get().isActiveAccount());
        userRepository.save(user.get());
    }

    @Caching(evict = {
            @CacheEvict(value = "users", allEntries = true),
            @CacheEvict(value = "admins", allEntries = true)
    })
    public void switchRole(UUID userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserDoesNotExistException(NO_SUCH_USER_FOUND);
        }

        user.get().setRole(user.get().getRole() == ADMIN ? USER : ADMIN);

        userRepository.save(user.get());
    }

    public void editUserDetails(UUID userid, EditUserRequest editRequest) {
        Optional<User> user = userRepository.findById(userid);

        if (user.isEmpty()) {
            throw new UserDoesNotExistException(NO_SUCH_USER_FOUND);
        }

        user.get().setProfilePictureURL(editRequest.getProfilePictureURL());
        user.get().setUsername(editRequest.getUsername());
        user.get().setInstagramURL(editRequest.getInstagramURL());
        user.get().setLinkedinURL(editRequest.getLinkedinURL());
        user.get().setUniversity(editRequest.getUniversity());
        user.get().setMajor(editRequest.getMajor());
        user.get().setGraduationYear(editRequest.getGraduationYear());

        userRepository.save(user.get());

        log.info(USER_UPDATED_SUCCESSFULLY);

    }

    public User getById(UUID userId) {
        return userRepository.findById(userId)
                             .orElseThrow(() -> new UserDoesNotExistException("User with id: %s does not exist".formatted(userId)));


    }

    @Cacheable("users")
    public List<User> getAllUsers() {
        return userRepository.findAll()
                             .stream()
                             .sorted((u1, u2) -> {
                                 int firstNameComparison = u1.getFirstName().compareToIgnoreCase(u2.getFirstName());
                                 if (firstNameComparison != 0) {
                                     return firstNameComparison;
                                 }
                                 return u1.getLastName().compareToIgnoreCase(u2.getLastName());
                             })
                             .toList();
    }

    public Integer getActiveUsersCount() {
        return userRepository
                .getAllByActiveAccount(ACTIVE_ACCOUNT).size();
    }

    @Cacheable("admins")
    public Integer getAdminsCount() {
        return userRepository
                .getAllByRole(ADMIN).size();
    }

    public Integer getGraduatedCount() {
        return userRepository
                .getAllByGraduationYearBefore(LocalDateTime.now().getYear()).size();
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession currentSession = servletRequestAttributes.getRequest().getSession(true);
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                                  .orElseThrow(() -> new UserDoesNotExistException(NO_SUCH_USER_FOUND));

        if (!user.isActiveAccount())
            currentSession.setAttribute("Inactive", "This account is blocked!");

        return new AuthenticationMetaData(user.getId(), user.getUsername(), user.getPassword(),  user.getRole(), user.isActiveAccount());
    }
}
