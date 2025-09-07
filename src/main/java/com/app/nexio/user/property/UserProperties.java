package com.app.nexio.user.property;

import com.app.nexio.user.model.UserRole;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "domain.user.properties")
public class UserProperties {

    private UserRole userRole;
    private boolean activeByDefault;

}
