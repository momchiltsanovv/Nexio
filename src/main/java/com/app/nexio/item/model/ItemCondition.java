package com.app.nexio.item.model;

import lombok.Getter;

@Getter
public enum ItemCondition {
    NEW("New"),
    LIKE_NEW("Like New"),
    GOOD("Good"),
    FAIR("Fair"),
    POOR("Poor"),
    REFURBISHED("Refurbished");

    private final String displayName;

    ItemCondition(String displayName) {
        this.displayName = displayName;
    }

}