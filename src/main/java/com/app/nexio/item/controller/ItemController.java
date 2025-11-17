package com.app.nexio.item.controller;


import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import com.app.nexio.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public String getViewItemsPage(@AuthenticationPrincipal AuthenticationMetadata userDetails,
                                   @PathVariable UUID id,
                                   Model model) {

        model.addAttribute("active", "home");

        Item item = itemService.getById(id);
        itemService.validateItemAccess(item, userDetails);
        model.addAttribute("item", item);

        User user = userService.getById(userDetails.getUserId());
        model.addAttribute("user", user);

        boolean inWishlist = wishlistService.isInWishlist(id, user.getWishlist());
        model.addAttribute("isInWishlist", inWishlist);

        return "item-view";
    }

    @GetMapping("/{itemId}/details")
    public String getEditItemPage(@PathVariable UUID itemId,
                                  @AuthenticationPrincipal AuthenticationMetadata userDetails,
                                  Model model) {
        model.addAttribute("active", "item");

        Item item = itemService.getById(itemId);
        itemService.validateItemAccess(item, userDetails);

        model.addAttribute("item", item);
        model.addAttribute("editItemRequest", EditItemRequest.fromItem(item));

        return "edit-item";
    }

    @PatchMapping("/{id}/details")
    public String updateItem(@PathVariable UUID id,
                             @Valid EditItemRequest editRequest,
                             @RequestParam(value = "files", required = false) MultipartFile file,
                             @AuthenticationPrincipal AuthenticationMetadata userDetails,
                             BindingResult bindingResult,
                             Model model) {

        if (bindingResult.hasErrors()) {
            Item item = itemService.getById(id);
            itemService.validateItemAccess(item, userDetails);
            model.addAttribute("item", item);
            return "edit-item";
        }

        Item item = itemService.getById(id);
        itemService.validateItemAccess(item, userDetails);
        itemService.editItem(id, editRequest, file);


        return "redirect:/items/" + id;
    }


    @GetMapping("/creation")
    public String getPostItemPage(Model model) {

        model.addAttribute("active", "post");
        model.addAttribute("postItemRequest", new PostItemRequest());

        return "post-item";
    }

    @PostMapping("/creation")
    public String postItem(@Valid PostItemRequest postItemRequest,
                           @RequestParam(value = "itemImageFile",
                                         required = false) MultipartFile itemImageFile,
                           @AuthenticationPrincipal AuthenticationMetadata userDetails,
                           BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return "home";
        }
        
        User owner = userService.getById(userDetails.getUserId());
        itemService.postItem(postItemRequest, itemImageFile, owner);

        return "redirect:/home";
    }

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable UUID id) {

        itemService.deleteItem(id);
        return "edit-item";
    }

}
