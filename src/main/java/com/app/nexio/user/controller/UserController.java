package com.app.nexio.user.controller;

import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.UUID;

@RequestMapping("/users")
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @GetMapping
//    @RequireAdminRole
//    public ModelAndView getAllUsers(HttpSession session) {
//
//        UUID userId = (UUID) session.getAttribute(USER_ID_SESSION_ATTRIBUTE);
//        User loggedUser = userService.getById(userId);
//
//        List<UserInformation> users = userService.getAllUsers().stream()
//                                                 .map(DtoMapper::toUserInformation)
//                                                 .toList();
//
//        ModelAndView modelAndView = new ModelAndView();
//        modelAndView.addObject("user", loggedUser);
//        modelAndView.addObject("users", users);
//        modelAndView.setViewName("users");
//
//        return modelAndView;
//    }
}
