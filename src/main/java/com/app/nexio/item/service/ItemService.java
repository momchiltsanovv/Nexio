package com.app.nexio.item.service;

import com.app.nexio.aws.service.AwsService;
import com.app.nexio.common.exception.ItemNotFoundException;
import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Category;
import com.app.nexio.item.model.Item;
import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.security.AuthenticationMetadata;
import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import lombok.extern.slf4j.Slf4j;
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

    public ItemService(ItemRepository itemRepository, AwsService awsService) {
        this.itemRepository = itemRepository;
        this.awsService = awsService;
    }

    public void postItem(PostItemRequest postItemRequest, MultipartFile file) {
        Item item = initializeItemFromRequest(postItemRequest, file);

        itemRepository.save(item);
    }


    public void editItem(UUID itemId, EditItemRequest editItemRequest, MultipartFile file) {
        Item item = getById(itemId);

        if (file != null && !file.isEmpty()) {
                String imageURL = uploadItemImage(itemId, file);
                item.setImageURL(imageURL);
        }

        item.setName(editItemRequest.getName());
        item.setPrice(editItemRequest.getPrice());
        item.setCondition(editItemRequest.getCondition());
        item.setDescription(editItemRequest.getDescription());
        item.setCategory(editItemRequest.getCategory());
        item.setExchangeLocation(editItemRequest.getExchangeLocation());

        itemRepository.save(item);
    }

    public String uploadItemImage(UUID itemId, MultipartFile file) {
        var response = awsService.uploadItemImage(itemId, file);
        var body = response.getBody();
        
        if (response.getStatusCode().is2xxSuccessful() && body != null && body.URL() != null) {
            return body.URL();
        }
        
        throw new RuntimeException("Failed to upload item image: " + (response.getStatusCode().is2xxSuccessful() ? "Invalid response" : response.getStatusCode()));
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
                             .orElseThrow(() -> new ItemNotFoundException(ITEM_NOT_FOUND));
    }

    public List<Item> findAllNonDeletedItems() {
        return itemRepository.findAllByOwnerActiveAccountTrueAndNotDeleted();
    }

    private Item initializeItemFromRequest(PostItemRequest postItemRequest, MultipartFile file) {


//        String URL = null;
//        if (file != null && !file.isEmpty()) {
//            URL = Objects.requireNonNull(awsService.sendAwsProfileFile(, file)
//                                                   .getBody())
//                         .URL();
//            item.get().setProfilePictureURL(URL);
//        }
//

        return Item.builder()
                   .name(postItemRequest.getName())
                   .price(postItemRequest.getPrice())
                   .condition(postItemRequest.getCondition())
                   .description(postItemRequest.getDescription())
                   .category(postItemRequest.getCategory())
                   .exchangeLocation(postItemRequest.getExchangeLocation())
//                   .imageURL(URL)
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

    public void validateItemAccess(Item item, AuthenticationMetadata user) {
        if (!item.getOwner().isActiveAccount()) {
            boolean isAdmin = user != null && user.getRole() == UserRole.ADMIN;
            if (!isAdmin) {
                throw new ItemNotFoundException(ITEM_NOT_FOUND);
            }
        }
    }
}
