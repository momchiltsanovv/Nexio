package com.app.nexio.security;

import com.app.nexio.user.model.UserRole;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class AuthenticationMetadata implements UserDetails, OAuth2User {

    public static final String ROLE_PREFIX = "ROLE_";
    private UUID userId;
    private String usernameOrEmail;
    private String password;
    private UserRole role;
    private boolean isAccountActive;
    private Map<String, Object> attributes;

    public AuthenticationMetadata(UUID userId, String usernameOrEmail, String password,
                                  UserRole role, boolean isAccountActive, Map<String, Object> attributes) {
        this.userId = userId;
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
        this.role = role;
        this.isAccountActive = isAccountActive;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        SimpleGrantedAuthority roles = new SimpleGrantedAuthority(ROLE_PREFIX + role.name());

        return List.of(roles);
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.usernameOrEmail;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.isAccountActive;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.isAccountActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.isAccountActive;
    }

    @Override
    public boolean isEnabled() {
        return this.isAccountActive;
    }

    @Override
    public String getName() {
        return attributes.get("name").toString();
    }
}
