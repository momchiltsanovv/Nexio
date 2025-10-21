package com.app.nexio.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebConfiguration implements WebMvcConfigurer {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(matcher -> matcher
                                           .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                                           .requestMatchers("/", "/auth/register", "/info").permitAll()
                                           .anyRequest().authenticated()
                                  )
            .formLogin(form -> form
                               .loginPage("/auth/login")
                               .usernameParameter("usernameOrEmail")
                               .defaultSuccessUrl("/home", true)
                               .failureUrl("/auth/login?error")
                               .permitAll()
                      )
            .logout(logout -> logout
                    .logoutUrl("/auth/logout")
                    .logoutSuccessUrl("/")
                   );


        return httpSecurity.build();
    }

}
