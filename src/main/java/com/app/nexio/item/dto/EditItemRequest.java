package com.app.nexio.item.dto;

import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.model.ItemCondition;
import com.app.nexio.item.model.Location;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditItemRequest {


    @NotBlank(message = "Item name is required")
    @Size(min = 2, message = "Item name must be at 2 characters")
    String name;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive number")
    BigDecimal price;

    @NotNull(message = "Item condition is required")
    ItemCondition condition;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    String description;

    @NotNull(message = "Category is required")
    Category category;

    @NotNull(message = "Location is required")
    Location exchangeLocation;

    String imageURL;


    public static EditItemRequest fromItem(Item item) {
        EditItemRequest request = new EditItemRequest();
        request.setImageURL(item.getImageURL());
        request.setName(item.getName());
        request.setCategory(item.getCategory());
        request.setCondition(item.getCondition());
        request.setExchangeLocation(item.getExchangeLocation());
        request.setPrice(item.getPrice());
        request.setDescription(item.getDescription());
        return request;
    }
}