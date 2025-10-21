package com.app.nexio.user.model;

import lombok.Getter;

@Getter
public enum University {
    NEW_BULGARIAN_UNIVERSITY("New Bulgarian University"),
    MEDICAL_UNIVERSITY_OF_SOFIA("Medical University Of Sofia"),
    SOFIA_UNIVERSITY_ST_KLIMENT_OHRIDSKI("Sofia University St. Kliment Ohridski"),
    TECHNICAL_UNIVERSITY_OF_SOFIA("Technical University Of Sofia"),
    UNIVERSITY_OF_NATIONAL_AND_WORLD_ECONOMY("University Of National and World Economy"),
    UNIVERSITY_OF_ARCHITECTURE_CIVIL_ENG_AND_GEODESY("University Of Architecture Civil Eng And Geodesy");

    private final String displayName;

    University(String displayName) {
        this.displayName = displayName;
    }

}

