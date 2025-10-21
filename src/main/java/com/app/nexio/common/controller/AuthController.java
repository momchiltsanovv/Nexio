package com.app.nexio.common.controller;

import com.app.nexio.user.dto.LoginRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String getRegisterPage(Model model) {

        model.addAttribute("registerRequest", new RegisterRequest());
        return "register";
    }

    @PostMapping("/register")
    public String  registerNewUser(@Valid RegisterRequest registerRequest,
                                   BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "register";
        }

        userService.register(registerRequest);


        return "redirect:/auth/login";
    }

    @GetMapping("/login")
    public String getLoginPage(Model model) {

        model.addAttribute("loginRequest", new LoginRequest());
        return "login";
    }
}
