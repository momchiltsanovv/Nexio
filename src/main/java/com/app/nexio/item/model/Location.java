package com.app.nexio.item.model;

import lombok.Getter;

@Getter
public enum Location {
    CAMPUS("Campus"),
    NEARBY("Nearby (same neighbourhood)"),
    SHIPPING("Shipping");

    private final String displayName;

    Location(String displayName) {
        this.displayName = displayName;
    }
}
