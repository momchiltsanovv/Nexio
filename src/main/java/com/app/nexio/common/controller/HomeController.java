package com.app.nexio.common.controller;


import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping
public class HomeController {

    private final UserService userService;
    private final ItemService itemService;

    public HomeController(UserService userService, ItemService itemService) {
        this.userService = userService;
        this.itemService = itemService;
    }

    @GetMapping("/")
    public String getIndexPage() {

        return "index";
    }

    @GetMapping("/home")
    public String getHomePage(Model model, HttpSession session) {

        UUID userId = (UUID) session.getAttribute("user_id");
        User user = userService.getById(userId);

        itemService.findAllItems();
        model.addAttribute("active", "home");

        return "home";
    }
    @GetMapping("/info")
    public String getInfoPage(Model model) {
        model.addAttribute("active", "info");
        return "info";
    }






}
