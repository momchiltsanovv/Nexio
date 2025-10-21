package com.app.nexio.user.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationDetails;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ItemService itemService;

    @Autowired
    public UserController(UserService userService, ItemService itemService) {
        this.userService = userService;
        this.itemService = itemService;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String getUsersPage(Model model) {
        List<User> users = userService.getAllUsers();
        Integer activeUsers = userService.getActiveUsersCount();
        Integer adminsCount = userService.getAdminsCount();
        Integer graduated = userService.getGraduatedCount();

        model.addAttribute("users", users);
        model.addAttribute("activeUsers", activeUsers);
        model.addAttribute("admins", adminsCount);
        model.addAttribute("graduated", graduated);

        model.addAttribute("active", "community");
        return "admin-users";
    }

    @GetMapping("/{id}")// see another users profile
    public String getUserProfilePage(@PathVariable UUID id,
                                     Model model) {

        model.addAttribute("active", "user-profile-view");
        User user = userService.getById(id);
        List<Item> usersItems = itemService.getUsersItems(user);
        model.addAttribute("user", user);
        model.addAttribute("items", usersItems);

        return "user-profile-view";
    }


    @GetMapping("/profile")
    public String getMyProfile(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                               Model model) {
        model.addAttribute("active", "profile");

        User user = userService.getById(authenticationDetails.getUserId());
        List<Item> userItems = itemService.getUsersItems(user);
        model.addAttribute("user", user);
        model.addAttribute("items", userItems);

        return "profile";
    }

    @GetMapping("/profile/edit") // get edit profile form
    public String getEditProfilePage(@AuthenticationPrincipal AuthenticationDetails authenticationdetails,
                                     Model model) {
        model.addAttribute("active", "profile");

        User user = userService.getById(authenticationdetails.getUserId());
        model.addAttribute("user", EditUserRequest.fromUser(user));

        return "edit-profile";
    }

    @PatchMapping("/profile/edit")
    public String editProfile(@AuthenticationPrincipal AuthenticationDetails authenticationdetails,
                              @Valid EditUserRequest request,
                              BindingResult bindingResult,
                              Model model) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("active", "profile");
            return "edit-profile";
        }

        userService.editUserDetails(authenticationdetails.getUserId(), request);

        return "redirect:/users/profile";
    }


    @DeleteMapping("/delete")//user delete its account
    public String deleteUser() {


        return "index";
    }

    //debug to see where brake
    @PatchMapping("/{id}/toggle-role")
    @PreAuthorize("hasRole('ADMIN')")
    public String toggleUserRole(@PathVariable UUID id) {
        userService.switchRole(id);
        return "redirect:/users";
    }

    //debug this also 2
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public String toggleUserStatus(@PathVariable UUID id) {
        userService.switchStatus(id);
        return "redirect:/users";
    }


}
