package com.app.nexio.item.service;

import com.app.nexio.common.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ItemService {


    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public void postItem(PostItemRequest postItemRequest) {
        Item item = initializeItemFromRequest(postItemRequest);

        itemRepository.save(item);
    }


    public void editItem(UUID itemId, EditItemRequest editItemRequest) {
        Item item = getById(itemId);

        item.setName(editItemRequest.getName());
        item.setPrice(editItemRequest.getPrice());
        item.setCondition(editItemRequest.getCondition());
        item.setDescription(editItemRequest.getDescription());
        item.setCategory(editItemRequest.getCategory());
        item.setExchangeLocation(editItemRequest.getExchangeLocation());
        item.setImageURLs(editItemRequest.getImageURLs());

        itemRepository.save(item);
    }

    public List<Item> getUsersItems(User currentUser) {
        return itemRepository.findByOwnerAndNotDeleted(currentUser);
    }

    public Item getUserItem(UUID itemId, User currentUser) {
        return itemRepository.findByOwnerAndId(itemId, currentUser)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found or access denied"));
    }

    public Item getById(UUID itemId) {
        return itemRepository.findByIdAndNotDeleted(itemId)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found"));
    }

    public List<Item> findAllNonDeletedItems() {
        return itemRepository.findAllByOwnerActiveAccountTrueAndNotDeleted();
    }

    private Item initializeItemFromRequest(PostItemRequest postItemRequest) {
        return Item.builder()
                   .name(postItemRequest.getName())
                   .price(postItemRequest.getPrice())
                   .condition(postItemRequest.getCondition())
                   .description(postItemRequest.getDescription())
                   .category(postItemRequest.getCategory())
                   .exchangeLocation(postItemRequest.getExchangeLocation())
                   .imageURLs(postItemRequest.getImageURLs())//TODO get image url from cloud
                   .build();

    }

    public Integer getCategoryCount(Category category) {
        return itemRepository.findByCategoryAndOwnerActiveAccountTrueAndNotDeleted(category).size();
    }

    public void deleteItem(UUID id) {
        Item item = getById(id);
        item.setDeleted(true);
        itemRepository.save(item);
    }

    public void validateItemAccess(Item item, AuthenticationMetadata viewer) {
        if (!item.getOwner().isActiveAccount()) {
            boolean isAdmin = viewer != null && viewer.getRole() == UserRole.ADMIN;
            if (!isAdmin) {
                throw new ItemNotFoundException("Item not found");
            }
        }
    }
}
