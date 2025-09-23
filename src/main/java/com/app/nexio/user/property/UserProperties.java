package com.app.nexio.user.property;

import com.app.nexio.user.model.UserRole;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;


@Data
@Validated
@ConfigurationProperties(prefix = "users")
public class UserProperties {

    private DefaultUser defaultUser;

    @Data
    static class DefaultUser {

        private UserRole userRole;
        private boolean activeByDefault;
    }

}
