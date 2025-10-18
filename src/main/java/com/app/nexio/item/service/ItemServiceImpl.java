package com.app.nexio.item.service;

import com.app.nexio.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.user.model.User;
import jakarta.persistence.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ItemServiceImpl implements ItemService {


    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public void postItem(PostItemRequest postItemRequest) {
        Item item = initializeItemFromRequest(postItemRequest);

        itemRepository.save(item);
    }


    @Override
    public void editItem(UUID itemId, EditItemRequest editItemRequest) {
        Item item = getById(itemId);

        // Update item fields
        item.setName(editItemRequest.getName());
        item.setPrice(editItemRequest.getPrice());
        item.setCondition(editItemRequest.getCondition());
        item.setDescription(editItemRequest.getDescription());
        item.setCategory(editItemRequest.getCategory());
        item.setExchangeLocation(editItemRequest.getExchangeLocation());

        itemRepository.save(item);
    }

    @Override
    public List<Item> getUsersItems(User currentUser) {
        return itemRepository.findByOwner(currentUser);
    }

    @Override
    public Item getUserItem(UUID itemId, User currentUser) {
        return itemRepository.findByOwnerAndId(itemId, currentUser)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found or access denied"));
    }

    @Override
    public Item getById(UUID itemId) {
        return itemRepository.findById(itemId)
                             .orElseThrow(() -> new ItemNotFoundException("Item not found"));
    }

    @Override
    public List<Item> findAllItems() {

        List<Item> allItems= itemRepository.findAll();
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

}
