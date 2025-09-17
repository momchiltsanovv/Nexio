package com.app.nexio.user.model;

import com.app.nexio.wishlist.model.Wishlist;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,
            length = 20)
    private UserRole role;

    @Column(columnDefinition = "TEXT")
    private String major;

    @Column(columnDefinition = "TEXT")
    private String instagramURL;

    @Column(columnDefinition = "TEXT")
    private String linkedinURL;

    private Integer graduationYear;

    private boolean active;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private University university;

    @Column(columnDefinition = "TEXT")
    private String profilePictureURL;

    @Column(unique = true,
            nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;


    // One user can have only one wishlist
    @OneToOne(cascade = CascadeType.ALL,
              orphanRemoval = true,
              fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id")
    private Wishlist wishlist;


    @Column(nullable = false,
            updatable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedOn;


}
