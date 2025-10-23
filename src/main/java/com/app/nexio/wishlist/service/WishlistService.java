package com.app.nexio.wishlist.service;

import com.app.nexio.exception.userAlreadyHaveWishlistException;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.Wishlist;
import com.app.nexio.wishlist.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.UUID;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ItemService itemService;

    public WishlistService(WishlistRepository wishlistRepository, ItemService itemService) {
        this.wishlistRepository = wishlistRepository;
        this.itemService = itemService;
    }

    //TODO IMPL ADD ITEM
    public void addItem(User user, UUID itemId) {

    }

    // TODO IMPL REMOVE ITEM
    public void removeItem(User user, UUID itemId) {

    }

    public void initializeWishlist(User user) {
        if (user.getWishlist() != null) {
            throw new userAlreadyHaveWishlistException("user have a wishlist cant create a new one");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setItems(new HashSet<>());
        user.setWishlist(wishlist);
        wishlistRepository.save(wishlist);
    }


}
