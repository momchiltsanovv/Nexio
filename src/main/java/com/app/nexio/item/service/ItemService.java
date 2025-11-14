package com.app.nexio.item.service;

import com.app.nexio.common.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.user.model.User;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
        return itemRepository.findByOwner(currentUser);
    }

    public Item getUserItem(UUID itemId, User currentUser) {
        return itemRepository.findByOwnerAndId(itemId, currentUser)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found or access denied"));
    }

    public Item getById(UUID itemId) {
        return itemRepository.findById(itemId)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found"));
    }

    public List<Item> findAllNonDeletedItems() {

        List<Item> allItems = itemRepository.findAllByIsDeletedFalse();
        allItems.sort(Comparator.comparing(Item::getCreatedOn));
        return allItems;

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
        return itemRepository.findAll()
                             .stream()
                             .filter(item -> item.getCategory() == category && !item.isDeleted())
                             .toList()
                             .size();

    }

}
