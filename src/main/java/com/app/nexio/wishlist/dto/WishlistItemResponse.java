package com.app.nexio.wishlist.dto;

import com.app.nexio.item.model.Item;

import java.util.UUID;

public record WishlistItemResponse(
        UUID id,
        Item item
) {
}
