package com.app.nexio.user.controller;

import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public String getUsersPage(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAllAttributes(users);
        return "admin-users";
    }

    @GetMapping("/{id}")// see another users profile
    public String getUserProfilePage(@PathVariable UUID id,
                                     Model model) {
        User user = userService.getById(id);
        model.addAttribute("user", user);

        return "user-profile-view";
    }

    @GetMapping("/profile") // get current users profile
    public String getMyProfile() {

        return "profile";
    }

    @GetMapping("/profile/edit") // get edit profile form
    public String getEditProfilePage(Model model) {
       
        return "edit-profile";
    }

    
    @DeleteMapping("/delete")//user delete its account
    public String deleteUser() {
        // Get current authenticated user
        // For now, we'll implement a simple logout and redirect
        // In a real implementation, you would:
        // 1. Get the current user from SecurityContext
        // 2. Delete all user-related data (items, wishlist, messages, etc.)
        // 3. Delete the user account
        // 4. Invalidate the session
        
        return "index";
    }




}
