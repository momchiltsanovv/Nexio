package com.app.nexio.wishlist.service;

import com.app.nexio.exception.userAlreadyHaveWishlistException;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.Wishlist;
import com.app.nexio.wishlist.model.WishlistItem;
import com.app.nexio.wishlist.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ItemService itemService;

    public WishlistService(WishlistRepository wishlistRepository, ItemService itemService) {
        this.wishlistRepository = wishlistRepository;
        this.itemService = itemService;
    }

    public void addItem(User user, UUID itemId) {
        Wishlist wishlist = user.getWishlist();
        Set<WishlistItem> items = wishlist.getItems();

        // Check if item is already in wishlist
        boolean itemExists = items.stream()
                .anyMatch(wishlistItem -> wishlistItem.getItem().getId().equals(itemId));

        if (!itemExists) {
            items.add(WishlistItem.builder()
                                  .item(itemService.getById(itemId))
                                  .build());
            wishlistRepository.save(wishlist);
        }
    }

    public void removeItem(User user, UUID itemId) {
        Wishlist wishlist = user.getWishlist();
        Set<WishlistItem> items = wishlist.getItems();

        items.removeIf(wishlistItem -> wishlistItem
                .getItem()
                .getId()
                .equals(itemId));

        wishlistRepository.save(wishlist);
    }

    public Wishlist initializeWishlist(User user) {
        if (user.getWishlist() != null) {
            throw new userAlreadyHaveWishlistException("user have a wishlist cant create a new one");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setItems(new HashSet<>());
        user.setWishlist(wishlist);
        wishlistRepository.save(wishlist);
        return wishlist;
    }


}
