package com.app.nexio.item.service;

import com.app.nexio.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.user.model.User;
import org.springframework.stereotype.Service;

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

        //        item.setOwner(); //TODO get user from state


        itemRepository.save(item);
    }


    @Override
    public void editItem(UUID itemId, EditItemRequest editItemRequest, User currentUser) {
        Item item = getUserItem(itemId, currentUser);

        // Update item fields
        item.setName(editItemRequest.getName());
        item.setPrice(editItemRequest.getPrice());
        item.setCondition(editItemRequest.getCondition());
        item.setDescription(editItemRequest.getDescription());
        item.setCategory(editItemRequest.getCategory());
        item.setLocation(editItemRequest.getExchangeLocation());
        item.setImageURLs(editItemRequest.getImageURLs());

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
    

    private Item initializeItemFromRequest(PostItemRequest postItemRequest) {
        return Item.builder()
                   .name(postItemRequest.getName())
                   .price(postItemRequest.getPrice())
                   .condition(postItemRequest.getCondition())
                   .description(postItemRequest.getDescription())
                   .category(postItemRequest.getCategory())
                   .location(postItemRequest.getLocation())
                   .imageURLs(postItemRequest.getImageURLs())//TODO get image url from cloud
                   .build();

    }

}
