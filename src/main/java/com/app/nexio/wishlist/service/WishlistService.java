package com.app.nexio.wishlist.service;

import com.app.nexio.common.exception.ItemAlreadyInWishlist;
import com.app.nexio.common.exception.userAlreadyHaveWishlistException;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.service.ItemService;
import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.Wishlist;
import com.app.nexio.wishlist.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class WishlistService {

    public static final String ITEM_ALREADY_IN_YOUR_WISHLIST = "Item is already saved in your wishlist";
    public static final String USER_ALREADY_HAVE_WISHLIST = "user have a wishlist cant create a new one";
    private final WishlistRepository wishlistRepository;
    private final ItemService itemService;

    public WishlistService(WishlistRepository wishlistRepository, ItemService itemService) {
        this.wishlistRepository = wishlistRepository;
        this.itemService = itemService;
    }

    public void addItem(User user, UUID itemId) {
        Wishlist wishlist = user.getWishlist();
        Set<Item> items = wishlist.getItems();
        Item itemToAdd = itemService.getById(itemId);

        if (isInWishlist(itemId, wishlist)) {
            throw new ItemAlreadyInWishlist(ITEM_ALREADY_IN_YOUR_WISHLIST);
        }

        items.add(itemToAdd);
        wishlistRepository.save(wishlist);
    }

    public void removeItem(User user, UUID itemId) {
        Wishlist wishlist = user.getWishlist();
        Set<Item> items = wishlist.getItems();
        Item itemToRemove = itemService.getById(itemId);

        items.remove(itemToRemove);
        wishlistRepository.save(wishlist);
    }

    public boolean isInWishlist(UUID itemId, Wishlist wishlist) {
        Item item = itemService.getById(itemId);

        return wishlist.getItems()
                       .contains(item);
    }

    public void initializeWishlist(User user) {
        if (user.getWishlist() != null) {
            throw new userAlreadyHaveWishlistException(USER_ALREADY_HAVE_WISHLIST);
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setItems(new HashSet<>());
        user.setWishlist(wishlist);
    }

    public void clearWishlist(User user) {
        Wishlist wishlist = user.getWishlist();
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
    }
}
