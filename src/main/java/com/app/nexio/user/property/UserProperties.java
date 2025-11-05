package com.app.nexio.user.property;

import com.app.nexio.user.model.UserRole;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;


@Data
@Validated
@ConfigurationProperties(prefix = "users")
public class UserProperties {

    private defaultUser defaultUser;
    private adminUser adminUser;

    @Data
    public static class defaultUser {
        private UserRole userRole;
        private boolean activeByDefault;
    }

    @Data
    public static class adminUser {
        private UserRole userRole;
        private boolean activeByDefault;
    }

}
