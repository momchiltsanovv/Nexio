package com.app.nexio.item.model;

import lombok.Getter;

@Getter
public enum Category {
    TEXTBOOKS("Textbooks"),
    ELECTRONICS("Electronics"),
    FURNITURE("Furniture"),
    CLOTHING("Clothing"),
    SPORTS("Sports"),
    ACCESSORIES("Accessories"),
    SERVICES("Services");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;

    }

}
