package com.app.nexio.item.controller;


import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.security.AuthenticationDetails;
import com.app.nexio.user.model.User;
import com.app.nexio.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;
    private final UserService userService;

    @Autowired
    public ItemController(ItemService itemService, UserService userService) {
        this.itemService = itemService;
        this.userService = userService;
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


        return "item-view" + id;
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

}
