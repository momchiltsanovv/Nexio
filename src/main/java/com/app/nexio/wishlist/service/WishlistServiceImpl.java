package com.app.nexio.wishlist.service;

import com.app.nexio.exception.userAlreadyHaveWishlistException;
import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.Wishlist;
import com.app.nexio.wishlist.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.UUID;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @Override
    public void addItem(User user, UUID itemId) {

    }

    @Override
    public void removeItem(User user, UUID itemId) {

    }

    @Override
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
