package com.app.nexio.wishlist.model;

import com.app.nexio.item.model.Item;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "wishlists")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToMany(fetch = FetchType.LAZY,
                cascade = CascadeType.ALL)
    @JoinTable(name = "wishlist_items",
               joinColumns = @JoinColumn(name = "wishlist_id"),
               inverseJoinColumns = @JoinColumn(name = "item_id"))
    private Set<Item> items;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;

    @UpdateTimestamp
    private LocalDateTime updatedOn;
}
