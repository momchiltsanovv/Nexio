package com.app.nexio.wishlist.service;

import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.Wishlist;

import java.util.UUID;

public interface WishlistService {

    void addItem(User user , UUID itemId);

    void removeItem(User user, UUID itemId);

    Wishlist initializeWishlist(User user);

}
