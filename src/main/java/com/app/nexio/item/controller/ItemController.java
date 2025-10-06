package com.app.nexio.item.controller;


import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/{id}")
    public String getViewItemsPage(@PathVariable UUID id,
                                   Model model) {
        model.addAttribute("active", "home");
        Item item = itemService.getById(id);
        model.addAttribute("item", item);

        return "item-view";
    }

    @GetMapping("/{id}/edit") // get edit item form
    public String getEditItemPage(@PathVariable UUID id, Model model, HttpSession session) {
        model.addAttribute("active", "home");
        
        // Get current user from session
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return "redirect:/login";
        }
        
        // Get the item and verify ownership
        Item item = itemService.getUserItem(id, currentUser);
        
        // Create EditItemRequest with current item data
        EditItemRequest editItemRequest = EditItemRequest.builder()
                .name(item.getName())
                .price(item.getPrice())
                .condition(item.getCondition())
                .description(item.getDescription())
                .category(item.getCategory())
                .exchangeLocation(item.getLocation())
                .imageURLs(item.getImageURLs())
                .build();
        
        model.addAttribute("item", item);
        model.addAttribute("editItemRequest", editItemRequest);

        return "edit-item";
    }

    @PutMapping("/{id}/edit") //Update item
    public String updateItem(@PathVariable UUID id) {

        return "edit-item";
    }

    @GetMapping("/post") // get post item form
    public String getPostItemPage(Model model) {

        model.addAttribute("active", "post");
        model.addAttribute("postItemRequest", new PostItemRequest());

        return "post-item";
    }

    @PostMapping("/post") // get post item form
    public String postItem(@Valid PostItemRequest postItemRequest, BindingResult bindingResult) {

        if(bindingResult.hasErrors()) {
            return "home";
        }
        itemService.postItem(postItemRequest);

        return "home";
    }

    @DeleteMapping("/{id}/delete") //Delete item
    public String deleteItem(@PathVariable UUID id) {

        return "edit-item";
    }
}
