package com.app.nexio.wishlist.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.security.AuthenticationDetails;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Set;

@Controller
@RequestMapping
public class WishlistController {
    private final UserService userService;

    public WishlistController(UserService userService) {
        this.userService = userService;
    }

    //TODO make the whole controller functionality and displaying items in the wishlist page

    @GetMapping("/wishlist")
    public String getWishlistPage(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                                  Model model) {

        User user = userService.getById(authenticationDetails.getUserId());
        Set<Item> wishlistItems = user.getWishlist().getItems();

        model.addAttribute("wishlistItems", wishlistItems);
        model.addAttribute("active", "wishlist");

        return "wishlist";
    }

}
