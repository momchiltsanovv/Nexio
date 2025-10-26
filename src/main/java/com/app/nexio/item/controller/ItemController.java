package com.app.nexio.item.controller;


import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationDetails;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import com.app.nexio.wishlist.model.Wishlist;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.UUID;

@Controller
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;
    private final UserService userService;
    private final WishlistService wishlistService;

    @Autowired
    public ItemController(ItemService itemService, UserService userService, WishlistService wishlistService) {
        this.itemService = itemService;
        this.userService = userService;
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{id}")
    public String getViewItemsPage(@AuthenticationPrincipal AuthenticationDetails userDetails,
                                   @PathVariable UUID id,
                                   Model model) {

        model.addAttribute("active", "home");

        Item item = itemService.getById(id);
        model.addAttribute("item", item);

        User user = userService.getById(userDetails.getUserId());
        model.addAttribute("user", user);

        boolean inWishlist = wishlistService.isInWishlist(id, user.getWishlist());
        model.addAttribute("isInWishlist", inWishlist);

        return "item-view";
    }

    @GetMapping("/{itemId}/edit")
    public String getEditItemPage(@PathVariable UUID itemId,
                                  Model model) {
        model.addAttribute("active", "item");

        Item item = itemService.getById(itemId);

        model.addAttribute("item", item);
        model.addAttribute("editItemRequest", EditItemRequest.fromItem(item));

        return "edit-item";
    }

    @PatchMapping("/{id}/edit") //Update item
    public String updateItem(@PathVariable UUID id,
                             @Valid EditItemRequest editRequest,
                             BindingResult bindingResult,
                             Model model) {

        if (bindingResult.hasErrors()) {
            Item item = itemService.getById(id);
            model.addAttribute("item", item);
            return "edit-item";
        }

        itemService.editItem(id, editRequest);


        return "redirect:/item-view/" + id;
    }

    @PostMapping("/{id}/add")
    public String addToWishlist(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                                @PathVariable UUID id) {

        User user = userService.getById(authenticationDetails.getUserId());
        wishlistService.addItem(user, id);


        return "redirect:/items/" + id;
    }

    @GetMapping("/post")
    public String getPostItemPage(Model model) {

        model.addAttribute("active", "post");
        model.addAttribute("postItemRequest", new PostItemRequest());

        return "post-item";
    }

    @PostMapping("/post")
    public String postItem(@Valid PostItemRequest postItemRequest,
                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "home";
        }
        itemService.postItem(postItemRequest);

        return "home";
    }

    @DeleteMapping("/{id}/delete")
    public String deleteItem(@PathVariable UUID id) {

        return "edit-item";
    }

    //TODO figure out how to return the page you are currently on
    @DeleteMapping("/{id}/remove")
    public String removeFromWishlist(@AuthenticationPrincipal AuthenticationDetails authenticationDetails,
                                     @PathVariable UUID id,
                                     HttpServletRequest request) {
        User user = userService.getById(authenticationDetails.getUserId());
        wishlistService.removeItem(user, id);

        String referer = request.getHeader("Referer");
        return "redirect:" + referer;
    }

}
