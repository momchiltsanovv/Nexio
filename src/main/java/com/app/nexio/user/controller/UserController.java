package com.app.nexio.user.controller;

import com.app.nexio.exception.UsernameAlreadyTakenException;
import com.app.nexio.user.dto.RegisterRequest;
import com.app.nexio.user.model.User;
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
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.UUID;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "tab", defaultValue = "login") String tab, Model model) {
        model.addAttribute("tab", tab);
        return "login";
    }

    @PostMapping("/login")
    public String handleLogin(@RequestParam String username, 
                            @RequestParam String password,
                            HttpSession session,
                            RedirectAttributes redirectAttributes) {
        try {
            // For now, we'll implement a simple authentication
            // In a real application, you'd use Spring Security
            User user = userService.findByUsername(username);
            
            if (user != null && userService.checkPassword(password, user.getPassword())) {
                session.setAttribute("userId", user.getId());
                session.setAttribute("username", user.getUsername());
                redirectAttributes.addFlashAttribute("message", "Login successful!");
                return "redirect:/";
            } else {
                redirectAttributes.addAttribute("tab", "login");
                redirectAttributes.addFlashAttribute("error", "Invalid username or password");
                return "redirect:/login";
            }
        } catch (Exception e) {
            redirectAttributes.addAttribute("tab", "login");
            redirectAttributes.addFlashAttribute("error", "Login failed. Please try again.");
            return "redirect:/login";
        }
    }

    @PostMapping("/register")
    public String handleRegister(@Valid RegisterRequest registerRequest,
                               BindingResult bindingResult,
                               RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addAttribute("tab", "register");
            redirectAttributes.addFlashAttribute("error", "Please fix the validation errors");
            return "redirect:/login";
        }

        try {
            User user = userService.register(registerRequest);
            redirectAttributes.addAttribute("tab", "login");
            redirectAttributes.addFlashAttribute("message", "Account created successfully! Please sign in.");
            return "redirect:/login";
        } catch (UsernameAlreadyTakenException e) {
            redirectAttributes.addAttribute("tab", "register");
            redirectAttributes.addFlashAttribute("error", "Username already taken. Please choose another.");
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addAttribute("tab", "register");
            redirectAttributes.addFlashAttribute("error", "Registration failed. Please try again.");
            return "redirect:/login";
        }
    }

    @PostMapping("/logout")
    public String handleLogout(HttpSession session, RedirectAttributes redirectAttributes) {
        session.invalidate();
        redirectAttributes.addFlashAttribute("message", "You have been logged out successfully.");
        return "redirect:/login";
    }

    @GetMapping("/users")
    public ModelAndView getAllUsers(HttpSession session) {
        // This would require admin role in a real application
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("users");
        return modelAndView;
    }
}
