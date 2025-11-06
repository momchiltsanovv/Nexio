package com.app.nexio.config;

import com.app.nexio.notification.client.NotificationClient;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.cloud.openfeign.EnableFeignClients;

@Configuration
@ConfigurationPropertiesScan
@EnableFeignClients(clients = NotificationClient.class)
public class BeanConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
    }
    

}
