package com.app.nexio.item.service;

import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;
import org.springframework.stereotype.Service;

@Service
public class ItemServiceImpl implements ItemService{


    @Override // will get user from security context so no need for second parameter user
    public void postItem(PostItemRequest postItemRequest) {

    }

    @Override
    public void editPostedItem(EditItemRequest editItemRequest) {

    }
}
