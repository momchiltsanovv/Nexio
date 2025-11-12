package com.app.nexio.user.service;

import com.app.nexio.aws.service.AwsService;
import com.app.nexio.exception.UserDoesNotExistException;
import com.app.nexio.exception.UsernameTakenException;
import com.app.nexio.notification.service.NotificationService;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.security.model.Provider;
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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;

@Slf4j
@Service
public class UserService implements UserDetailsService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {

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
    private final NotificationService notificationService;
    private final AwsService awsService;

    @Autowired
    public UserService(UserRepository userRepository,
                       UserProperties userProperties,
                       PasswordEncoder passwordEncoder,
                       WishlistService wishlistService, NotificationService notificationService, AwsService awsService) {
        this.userRepository = userRepository;
        this.userProperties = userProperties;
        this.passwordEncoder = passwordEncoder;
        this.wishlistService = wishlistService;
        this.notificationService = notificationService;
        this.awsService = awsService;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByUsernameOrEmail(email);
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
        notificationService.sendNotificationWhenRegister(user.getId(), user.getEmail());

        log.info(USER_REGISTERED_SUCCESSFULLY);
    }

    private User initializeUserFromRequest(RegisterRequest registerRequest) {
        return User.builder()
                   .username(registerRequest.getUsername())
                   .role(userProperties.getDefaultUser()
                                       .getUserRole())
                   .activeAccount(userProperties.getDefaultUser()
                                                .isActiveByDefault())
                   .email(registerRequest.getEmail())
                   .password(getEncodedPassword(registerRequest))
                   .provider(Provider.LOCAL)
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

    public void editUserDetails(UUID userId, EditUserRequest editRequest, MultipartFile file) throws IOException {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            throw new UserDoesNotExistException(NO_SUCH_USER_FOUND);
        }

        String pictureURL = uploadProfilePictureAndGetURL(userId, file);

        if (file != null && !file.isEmpty()) {
            user.get().setProfilePictureURL(pictureURL);
        }

        user.get().setProfilePictureURL(pictureURL);
        user.get().setFirstName(editRequest.getFirstName());
        user.get().setLastName(editRequest.getLastName());
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
                                 String firstName1 = u1.getFirstName() != null ? u1.getFirstName() : "";
                                 String firstName2 = u2.getFirstName() != null ? u2.getFirstName() : "";
                                 int firstNameComparison = firstName1.compareToIgnoreCase(firstName2);
                                 if (firstNameComparison != 0) {
                                     return firstNameComparison;
                                 }
                                 String lastName1 = u1.getLastName() != null ? u1.getLastName() : "";
                                 String lastName2 = u2.getLastName() != null ? u2.getLastName() : "";
                                 return lastName1.compareToIgnoreCase(lastName2);
                             })
                             .toList();
    }

    private AuthenticationMetadata processOAuth2User(OAuth2User oAuth2User, String provider) {
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByUsernameOrEmail(email).orElse(null);
        if (user == null) {
            String[] wholeName = name.split(" ");
            String username = email.split("@")[0];

            user = User.builder()
                       .firstName(wholeName.length > 1 ? wholeName[0] : name)
                       .lastName(wholeName.length > 1 ? wholeName[1] : "")
                       .email(email)
                       .username(username)
                       .role(userProperties.getAdminUser().getUserRole())
                       .activeAccount(userProperties.getDefaultUser().isActiveByDefault())
                       .provider(Provider.valueOf(provider.toUpperCase()))
                       .build();

            wishlistService.initializeWishlist(user);
            userRepository.save(user);
            notificationService.sendNotificationWhenRegister(user.getId(), user.getEmail());
        }

        return new AuthenticationMetadata(user.getId(),
                                          user.getUsername(),
                                          user.getPassword(),
                                          user.getRole(),
                                          user.isActiveAccount(),
                                          oAuth2User.getAttributes()
        );
    }

    public Integer getActiveUsersCount() {
        return userRepository
                .getAllByActiveAccount(ACTIVE_ACCOUNT)
                .size();
    }

    @Cacheable("admins")
    public Integer getAdminsCount() {
        return userRepository
                .getAllByRole(ADMIN)
                .size();
    }

    public Integer getGraduatedCount() {
        return userRepository
                .getAllByGraduationYearBefore(LocalDateTime.now().getYear()).size();
    }

    public String uploadProfilePictureAndGetURL(UUID userId, MultipartFile file) throws IOException {
        String profilePictureURL = awsService.sendAwsFile(userId, file)
                                             .getBody()
                                             .getURL();

        log.info("Calling microservice to upload file: {}", file.getOriginalFilename());


        return profilePictureURL;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = new org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService().loadUser(userRequest);
        String provider = userRequest.getClientRegistration().getRegistrationId();
        return processOAuth2User(oAuth2User, provider);
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession currentSession = servletRequestAttributes.getRequest().getSession(true);
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                                  .orElseThrow(() -> new UserDoesNotExistException(NO_SUCH_USER_FOUND));

        if (!user.isActiveAccount())
            currentSession.setAttribute("Inactive", "This account is blocked!");

        return new AuthenticationMetadata(user.getId(),
                                          user.getUsername(),
                                          user.getPassword(),
                                          user.getRole(),
                                          user.isActiveAccount(),
                                          null
        );
    }
}
