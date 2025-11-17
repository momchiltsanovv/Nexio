package com.app.nexio.aws.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record S3Response(
        @JsonProperty("URL") String URL
) {
}