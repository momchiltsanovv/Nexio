package com.app.nexio.user.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.AccountDeletionService;
import com.app.nexio.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final AccountDeletionService accountDeletionService;

    @Autowired
    public UserController(UserService userService, ItemService itemService, AccountDeletionService accountDeletionService) {
        this.userService = userService;
        this.itemService = itemService;
        this.accountDeletionService = accountDeletionService;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String getUsersPage(@AuthenticationPrincipal AuthenticationMetadata metadata,
                               Model model) {
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

    @GetMapping("/{id}")
    public String getUserProfilePage(@PathVariable UUID id, Model model) {

        model.addAttribute("active", "user-profile-view");
        User user = userService.getById(id);
        List<Item> usersItems = itemService.getUsersItems(user);
        model.addAttribute("user", user);
        model.addAttribute("items", usersItems);

        return "user-profile-view";
    }


    @GetMapping("/profile")
    public String getMyProfile(@AuthenticationPrincipal AuthenticationMetadata metaData,
                               Model model) {
        model.addAttribute("active", "profile");

        User user = userService.getById(metaData.getUserId());
        List<Item> userItems = itemService.getUsersItems(user);
        model.addAttribute("user", user);
        model.addAttribute("items", userItems);

        return "profile";
    }

    //todo dont use verbs in endpoint  replace edit with details
    @GetMapping("/profile/edit")
    public String getEditProfilePage(@AuthenticationPrincipal AuthenticationMetadata metaData,
                                     Model model) {
        model.addAttribute("active", "profile");

        User user = userService.getById(metaData.getUserId());
        model.addAttribute("user", EditUserRequest.fromUser(user));

        return "edit-profile";
    }

    @PatchMapping("/profile/edit")
    public String editProfile(@AuthenticationPrincipal AuthenticationMetadata metaData,
                              @Valid EditUserRequest request,
                              BindingResult bindingResult,
                              Model model) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("active", "profile");
            return "edit-profile";
        }

        userService.editUserDetails(metaData.getUserId(), request);

        return "redirect:/users/profile";
    }

    @PatchMapping("/{id}/toggle-role")
    @PreAuthorize("hasRole('ADMIN')")
    public String toggleUserRole(@PathVariable UUID id) {
        userService.switchRole(id);
        return "redirect:/users";
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public String toggleUserStatus(@PathVariable UUID id) {
        userService.switchStatus(id);
        return "redirect:/users";
    }

    @DeleteMapping("/delete")
    public String deleteUser(@AuthenticationPrincipal AuthenticationMetadata metaData,
                             HttpServletRequest request,
                             HttpServletResponse response) {

        accountDeletionService.deleteUserAccount(
                metaData.getUserId(),
                request,
                response
                                                );

        return "redirect:/";
    }
}
