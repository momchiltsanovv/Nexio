package com.app.nexio.wishlist.controller;

import com.app.nexio.security.AuthenticationDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class WishlistController {

    //TODO make the whole controller functionality and displaying items in the wishlist page

    @GetMapping("/wishlist")
    public String getWishlistPage(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                                  Model model) {


        model.addAttribute("active", "wishlist");
        return "wishlist";
    }
}
