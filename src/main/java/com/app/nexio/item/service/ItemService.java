package com.app.nexio.item.service;

import com.app.nexio.item.dto.EditItemRequest;
import com.app.nexio.item.dto.PostItemRequest;

public interface ItemService {

    void postItem(PostItemRequest postItemRequest);
    void editPostedItem(EditItemRequest editItemRequest);

}
