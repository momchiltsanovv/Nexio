package com.app.nexio.wishlist.dto;

import java.util.List;
import java.util.UUID;

public record WishlistResponse (
        UUID id, // the wishlist id
        List<WishlistItemResponse> items // all items in wishlist
) {
}
