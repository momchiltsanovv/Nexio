package com.app.nexio.user.model;

import com.app.nexio.item.model.Item;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
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

    @Column(nullable = false,
            updatable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedOn;



}
