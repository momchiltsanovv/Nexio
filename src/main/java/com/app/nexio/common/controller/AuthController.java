package com.app.nexio.common.controller;

import com.app.nexio.user.dto.LoginRequest;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public String registerNewUser(@Valid RegisterRequest registerRequest,
                                  BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "register";
        }

        userService.register(registerRequest);


        return "redirect:/auth/login";
    }

    @GetMapping("/login")
    public String getLoginPage(@RequestParam(name = "error", required = false) String errorMessage,
                               Model model,
                               HttpSession session) {

        session.getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
        model.addAttribute("loginRequest", new LoginRequest());
        String inactiveMessage = (String) session.getAttribute("Inactive");
        if (inactiveMessage != null) {
            model.addAttribute("inactiveAccountError", inactiveMessage);
            session.removeAttribute("Inactive"); // Clear the session attribute
        } else if (errorMessage != null) {
            model.addAttribute("loginError", errorMessage);
        }
        return "login";
    }
}
