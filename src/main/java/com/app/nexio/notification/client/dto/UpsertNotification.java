package com.app.nexio.notification.client.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UpsertNotification {

    @NotNull
    private UUID userId;

    @NotBlank
    private String contactInfo;

    @NotNull
    private String type;

    private String subject;

    private String body;
}
