package com.app.nexio.wishlist.controller;

import com.app.nexio.item.model.Item;
import com.app.nexio.security.AuthenticationMetaData;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@Controller
@RequestMapping("/wishlist")
public class WishlistController {
    private final UserService userService;
    private final WishlistService wishlistService;

    public WishlistController(UserService userService, WishlistService wishlistService) {
        this.userService = userService;
        this.wishlistService = wishlistService;
    }


    @GetMapping
    public String getWishlistPage(@AuthenticationPrincipal AuthenticationMetaData authenticationDetails,
                                  Model model) {

        User user = userService.getById(authenticationDetails.getUserId());
        Set<Item> wishlistItems = user.getWishlist().getItems();

        model.addAttribute("wishlistItems", wishlistItems);
        model.addAttribute("active", "wishlist");

        return "wishlist";
    }

    @PostMapping("/{id}/add")
    public String addToWishlist(@AuthenticationPrincipal AuthenticationMetaData authenticationDetails,
                                @PathVariable UUID id) {

        User user = userService.getById(authenticationDetails.getUserId());
        wishlistService.addItem(user, id);


        return "redirect:/items/" + id;
    }

    @DeleteMapping("/{id}/remove")
    public String removeFromWishlist(@AuthenticationPrincipal AuthenticationMetaData authenticationDetails,
                                     @PathVariable UUID id,
                                     HttpServletRequest request) {
        User user = userService.getById(authenticationDetails.getUserId());
        wishlistService.removeItem(user, id);

        String referer = request.getHeader("Referer");
        return "redirect:" + referer;
    }

    @DeleteMapping("/clear")
    public String clearWishlist(@AuthenticationPrincipal AuthenticationMetaData authenticationDetails) {

        User user = userService.getById(authenticationDetails.getUserId());

        wishlistService.clearWishlist(user);

        System.out.println("what is happening ");
        return "redirect:/wishlist";
    }


}
