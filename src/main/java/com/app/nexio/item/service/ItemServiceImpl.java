package com.app.nexio.item.service;

import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import com.app.nexio.item.model.Item;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {


    @Override // will get user from security context -> no need for second parameter User
    public void postItem(PostItemRequest postItemRequest) {
        Item item = initializeItemFromRequest(postItemRequest);


    }


    @Override
    public void editPostedItem(EditItemRequest editItemRequest) {



    }

    private Item initializeItemFromRequest(PostItemRequest postItemRequest) {
       return Item.builder()
               .name(postItemRequest.name())
               .price(postItemRequest.price())
               .condition(postItemRequest.condition())
               .description(postItemRequest.description())
               .category(postItemRequest.category())
               .location(postItemRequest.location())
               .imageURLs(postItemRequest.imageURLs())
               .build();

    }

}
