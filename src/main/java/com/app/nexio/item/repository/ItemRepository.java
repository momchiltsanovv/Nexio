package com.app.nexio.item.repository;

import com.app.nexio.item.model.Item;
import com.app.nexio.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {

    @Query("SELECT i FROM Item i WHERE i.id = :itemId AND i.owner = :owner")
    Optional<Item> findByOwnerAndId(@Param("itemId") UUID itemId,
                                    @Param("owner") User owner);

    List<Item> findByOwner(User owner);

    List<Item> findAllByIsDeletedFalse();


}
