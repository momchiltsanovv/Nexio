package com.app.nexio.aws.client.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@Builder
public class AwsUserDetails {

    @NotNull
    private UUID userId;

    @NotNull
    private MultipartFile file;


}
