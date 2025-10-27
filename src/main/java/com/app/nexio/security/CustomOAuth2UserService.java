package com.app.nexio.security;

import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import com.app.nexio.user.repository.UserRepository;
import com.app.nexio.wishlist.service.WishlistService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;


@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final WishlistService wishlistService;
    private final PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(UserRepository userRepository, WishlistService wishlistService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.wishlistService = wishlistService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<User> existingUser = userRepository.findByUsernameOrEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            String usernameToUse;
            String firstNameToUse;
            String lastNameToUse;

            if (name != null && !name.isBlank()) {
                usernameToUse = name.toLowerCase().replace(" ", "");
                String[] nameParts = name.split(" ", 2);
                firstNameToUse = nameParts[0];
                lastNameToUse = nameParts.length > 1 ? nameParts[1] : "";
            } else if (email != null && !email.isBlank()) {
                usernameToUse = email.split("@")[0];
                firstNameToUse = email.split("@")[0];
                lastNameToUse = "";
            } else {
                usernameToUse = "oauth_user_" + UUID.randomUUID().toString().substring(0, 8);
                firstNameToUse = "OAuth";
                lastNameToUse = "User";
            }

            user = User.builder()
                       .email(email)
                       .username(usernameToUse)
                       .firstName(firstNameToUse)
                       .lastName(lastNameToUse)
                       .password(passwordEncoder.encode("ChangeMe@123"))
                       .role(UserRole.USER)
                       .activeAccount(true)
                       .build();
            wishlistService.initializeWishlist(user);
            userRepository.save(user);

        }

        //todo return authenticationMetadata
        return new AuthenticationMetadata(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                oauth2User.getAttributes(),
                userRequest.getClientRegistration()
                           .getProviderDetails()
                           .getUserInfoEndpoint()
                           .getUserNameAttributeName()
        );
    }
}
