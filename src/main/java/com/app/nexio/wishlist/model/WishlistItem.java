package com.app.nexio.wishlist.model;

import com.app.nexio.item.model.Item;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "wishlist_items")
public class WishlistItem { // entity to link items to wishlists

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Many users can add the same item to their wishlist
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id",
                nullable = false)
    private Item item;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedOn;
}