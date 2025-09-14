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
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Basic(fetch = FetchType.LAZY)
    private String profilePicture;

    @Column(nullable = false)
    private String university;

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
