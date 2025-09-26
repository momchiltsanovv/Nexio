package com.app.nexio.user.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import com.app.nexio.user.property.UserProperties;
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
    private final UserProperties userProperties;
    private final ItemService itemService;

    @Autowired
    public UserController(UserService userService, UserProperties userProperties, ItemService itemService) {
        this.userService = userService;
        this.userProperties = userProperties;
        this.itemService = itemService;
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
        List<Item> usersItems = itemService.getUsersItems(user);
        model.addAttribute("user", user);
        model.addAttribute("items", usersItems);

        return "user-profile-view";
    }


    @GetMapping("/profile")
    public String getMyProfile(Model model) {

        User user = userService.getByUsername("momo2");
        model.addAttribute(user);

        return "profile";
    }

    @GetMapping("/profile/edit") // get edit profile form
    public String getEditProfilePage(Model model) {
       
        return "edit-profile";
    }

    
    @DeleteMapping("/delete")//user delete its account
    public String deleteUser() {

        
        return "index";
    }




}
