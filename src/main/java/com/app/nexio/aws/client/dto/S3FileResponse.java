package com.app.nexio.aws.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class S3FileResponse {

    @JsonProperty("URL")
    private String URL;

}