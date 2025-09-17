package com.app.nexio.item.dto;

import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.ItemCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record PostItemRequest(
        @NotBlank(message = "Item name is required")
        @Size(min = 3, message = "Item name must be at least")
        String name,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,

        @NotNull(message = "Item condition is required")
        ItemCondition condition,

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
        String description,

        @NotNull(message = "Category is required")
        Category category,

        @NotBlank(message = "Location is required")
        String location,

        @Size(max = 5, message = "Maximum 5 images allowed")
        List<String> imageURLs
) {
}
