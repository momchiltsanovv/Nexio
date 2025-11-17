package com.app.nexio.item.dto;

import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.ItemCondition;
import com.app.nexio.item.model.Location;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostItemRequest {
        @NotBlank(message = "Item name is required")
        @Size(min = 3, message = "Item name must be at least")
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

        String imageURLs;
}
