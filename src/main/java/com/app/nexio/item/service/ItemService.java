package com.app.nexio.item.service;

import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.user.model.User;
import com.app.nexio.wishlist.model.WishlistItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ItemService {


    void postItem(PostItemRequest postItemRequest);

    void editItem(UUID itemId, EditItemRequest editItemRequest, User currentUser);

    List<Item> getUsersItems(User currentUser);

    Item getUserItem(UUID itemId, User currentUser);

    Item getById(UUID itemId);
}
