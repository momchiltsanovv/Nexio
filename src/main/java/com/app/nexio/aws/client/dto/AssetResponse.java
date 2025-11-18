package com.app.nexio.aws.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.UUID;

public record AssetResponse(
        @JsonProperty("id") UUID id,
        @JsonProperty("createdBy") UUID createdBy,
        @JsonProperty("createdOn") LocalDateTime createdOn,
        @JsonProperty("awsS3Path") String awsS3Path
) {
}
