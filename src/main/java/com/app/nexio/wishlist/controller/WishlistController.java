package com.app.nexio.wishlist.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class WishlistController {

    @GetMapping("/wishlist")
    public String getWishlistPage() {
        return "wishlist";
    }
}
