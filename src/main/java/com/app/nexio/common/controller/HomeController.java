package com.app.nexio.common.controller;


import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping
public class HomeController {

    private final ItemService itemService;

    public HomeController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/")
    public String getIndexPage() {

        return "index";
    }

    @GetMapping("/home")
    public String getHomePage(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                              Model model) {

        List<Item> items = itemService.findAllItems();
        model.addAttribute("items", items);

        model.addAttribute("active", "home");

        return "home";
    }

    @GetMapping("/info")
    public String getInfoPage(Model model) {
        model.addAttribute("active", "info");
        return "info";
    }






}
