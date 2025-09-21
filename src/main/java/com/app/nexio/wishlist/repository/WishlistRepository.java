package com.app.nexio.wishlist.repository;

import com.app.nexio.wishlist.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

}
