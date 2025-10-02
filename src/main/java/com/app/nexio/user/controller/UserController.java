package com.app.nexio.user.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.dto.EditUserRequest;
import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;
import com.app.nexio.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
        model.addAttribute("active", "community");
        model.addAllAttributes(users);
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
    public String getMyProfile(Model model, HttpSession session) {
        model.addAttribute("active", "profile");

        UUID userId = (UUID) session.getAttribute("user_id");
        if (userId == null) {
            return "redirect:/auth/login";
        }
        User user = userService.getById(userId);
        model.addAttribute(user);

        return "profile";
    }

    @GetMapping("/profile/edit") // get edit profile form
    public String getEditProfilePage(Model model) {

        model.addAttribute("user", new EditUserRequest());

        return "edit-profile";
    }

   @PostMapping("/profile/edit")
   public String editProfile(@Valid EditUserRequest request,
                             BindingResult bindingResult,
                             HttpSession session) {
       UUID userId = (UUID) session.getAttribute("user_id");
       if (bindingResult.hasErrors()) {
           return "profile";
       }

       userService.editUserDetails(userId, request);


       return "redirect:/users/profile";
   }

    
    @DeleteMapping("/delete")//user delete its account
    public String deleteUser() {

        
        return "index";
    }




}
