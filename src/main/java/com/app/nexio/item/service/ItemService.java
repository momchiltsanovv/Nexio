package com.app.nexio.item.service;

import com.app.nexio.aws.service.AwsService;
import com.app.nexio.common.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.notification.service.NotificationService;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ItemService {


    public static final String ITEM_NOT_FOUND = "Item not found";
    private final ItemRepository itemRepository;
    private final AwsService awsService;
    private final NotificationService notificationService;

    public ItemService(ItemRepository itemRepository, AwsService awsService, NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.awsService = awsService;
        this.notificationService = notificationService;
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "items", allEntries = true),
            @CacheEvict(value = "categoryCount", allEntries = true)
    })
    public void postItem(PostItemRequest postItemRequest, MultipartFile file, User owner) {
        Item item = initializeItemFromRequest(postItemRequest, owner);
        itemRepository.save(item);

        setImage(item.getId(), file, item, owner.getId());
        itemRepository.save(item);

        notificationService.sendNotificationWhenItemPosted(owner.getId(), owner.getEmail(), item.getName());
    }


    @Caching(evict = {
            @CacheEvict(value = "items", allEntries = true),
            @CacheEvict(value = "categoryCount", allEntries = true)
    })
    public void editItem(UUID itemId, EditItemRequest editItemRequest, MultipartFile file) {
        Item item = getById(itemId);

        item.setName(editItemRequest.getName());
        item.setPrice(editItemRequest.getPrice());
        item.setCondition(editItemRequest.getCondition());
        item.setDescription(editItemRequest.getDescription());
        item.setCategory(editItemRequest.getCategory());
        item.setExchangeLocation(editItemRequest.getExchangeLocation());
        setImage(itemId, file, item, item.getOwner().getId());

        itemRepository.save(item);
    }

    private void setImage(UUID itemId, MultipartFile file, Item item, UUID userId) {
        if (file != null && !file.isEmpty()) {
            String imageURL = uploadItemImage(itemId, userId, file);
            item.setImageURL(imageURL);
        }
    }

    private String uploadItemImage(UUID itemId, UUID userId, MultipartFile file) {
        var response = awsService.uploadItemImage(itemId, userId, file);
        var body = response.getBody();

        if (response.getStatusCode().is2xxSuccessful() && body != null && body.URL() != null) {
            return body.URL();
        }

        throw new RuntimeException("Failed to upload item image: " + (response.getStatusCode().is2xxSuccessful()
                ? "Invalid response"
                : response.getStatusCode()));
    }

    public List<Item> getUsersItems(User currentUser) {
        return itemRepository.findByOwnerAndNotDeleted(currentUser);
    }

    public Item getById(UUID itemId) {
        return itemRepository.findByIdAndNotDeleted(itemId)
                             .orElseThrow(() -> new ItemNotFoundException(ITEM_NOT_FOUND));
    }

    @Cacheable("items")
    public List<Item> findAllNonDeletedItems() {
        return itemRepository.findAllByOwnerActiveAccountTrueAndNotDeleted();
    }

    private Item initializeItemFromRequest(PostItemRequest postItemRequest, User owner) {
        return Item.builder()
                   .name(postItemRequest.getName())
                   .price(postItemRequest.getPrice())
                   .condition(postItemRequest.getCondition())
                   .description(postItemRequest.getDescription())
                   .category(postItemRequest.getCategory())
                   .exchangeLocation(postItemRequest.getExchangeLocation())
                   .owner(owner)
                   .build();

    }

    @Cacheable("categoryCount")
    public Integer getCategoryCount(Category category) {
        return itemRepository.findByCategoryAndOwnerActiveAccountTrueAndNotDeleted(category).size();
    }

    @CacheEvict(value = "items", allEntries = true)
    public void deleteItem(UUID id) {
        Item item = getById(id);
        item.setDeleted(true);
        itemRepository.save(item);
    }

    public void validateItemAccess(Item item, AuthenticationMetadata user) {
        if (!item.getOwner().isActiveAccount()) {
            boolean isAdmin = user != null && user.getRole() == UserRole.ADMIN;
            if (!isAdmin) {
                throw new ItemNotFoundException(ITEM_NOT_FOUND);
            }
        }
    }
}
