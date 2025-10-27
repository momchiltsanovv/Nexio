package com.app.nexio.common.controller;


import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping
public class HomeController {

    private final ItemService itemService;
    private final UserService userService;

    public HomeController(ItemService itemService, UserService userService) {
        this.itemService = itemService;
        this.userService = userService;
    }

    @GetMapping("/")
    public String getIndexPage() {

        return "index";
    }

    @GetMapping("/home")
    public String getHomePage(Model model) {

        List<Item> items = itemService.findAllItems();
        Integer textbooksCount = itemService.getCategoryCount(Category.TEXTBOOKS);
        Integer electronicsCount = itemService.getCategoryCount(Category.ELECTRONICS);
        Integer clothingCount = itemService.getCategoryCount(Category.CLOTHING);
        Integer furnitureCount = itemService.getCategoryCount(Category.FURNITURE);
        Integer sportsCount= itemService.getCategoryCount(Category.SPORTS);
        Integer accessoriesCount = itemService.getCategoryCount(Category.ACCESSORIES);
        Integer servicesCount = itemService.getCategoryCount(Category.SERVICES);

        model.addAttribute("textbooksCount", textbooksCount);
        model.addAttribute("electronicsCount", electronicsCount);
        model.addAttribute("clothingCount", clothingCount);
        model.addAttribute("furnitureCount", furnitureCount);
        model.addAttribute("sportsCount", sportsCount);
        model.addAttribute("accessoriesCount", accessoriesCount);
        model.addAttribute("servicesCount", servicesCount);
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
