package com.app.nexio.aws.client.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class S3FileResponse {

    private String URL;

}