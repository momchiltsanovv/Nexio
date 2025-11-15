package com.app.nexio.item.repository;

import com.app.nexio.item.model.Category;
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

    @Query("SELECT i FROM Item i WHERE i.id = :itemId AND i.owner = :owner AND i.isDeleted = false")
    Optional<Item> findByOwnerAndId(@Param("itemId") UUID itemId,
                                    @Param("owner") User owner);

    @Query("SELECT i FROM Item i WHERE i.id = :itemId AND i.isDeleted = false")
    Optional<Item> findByIdAndNotDeleted(@Param("itemId") UUID itemId);

    List<Item> findByOwner(User owner);

    @Query("SELECT i FROM Item i WHERE i.owner = :owner AND i.isDeleted = false")
    List<Item> findByOwnerAndNotDeleted(@Param("owner") User owner);

    @Query("SELECT i FROM Item i WHERE i.owner.activeAccount = true AND i.isDeleted = false ORDER BY i.createdOn")
    List<Item> findAllByOwnerActiveAccountTrueAndNotDeleted();

    @Query("SELECT i FROM Item i WHERE i.category = :category AND i.owner.activeAccount = true AND i.isDeleted = false")
    List<Item> findByCategoryAndOwnerActiveAccountTrueAndNotDeleted(@Param("category") Category category);

}
