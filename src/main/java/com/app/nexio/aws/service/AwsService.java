package com.app.nexio.aws.service;

import com.app.nexio.aws.client.AwsClient;
import com.app.nexio.aws.client.dto.AssetResponse;
import com.app.nexio.aws.client.dto.S3Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class AwsService {

    public static final String FEIGN_CALL_FAILED = "Feign call to AWS-S3-SVC failed due to {}";
    private final AwsClient awsClient;


    @Autowired
    public AwsService(AwsClient awsClient) {
        this.awsClient = awsClient;
    }

    public ResponseEntity<S3Response> sendAwsProfileFile(UUID userId, MultipartFile file) {
        var response = awsClient.upsertProfilePicture(userId, file);

        return getS3ResponseEntity(response);
    }

    public ResponseEntity<S3Response> uploadItemImage(UUID itemId, UUID userId, MultipartFile file) {
        var response = awsClient.upsertItemPictures(itemId, userId, file);

        return getS3ResponseEntity(response);
    }

    public ResponseEntity<List<AssetResponse>> getAssets() {
        var response = awsClient.getAssets();

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error(FEIGN_CALL_FAILED, response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode())
                                 .body(response.getBody());
        }

        return ResponseEntity.ok().body(response.getBody());
    }

    public List<AssetResponse> getAssetsByUserId(UUID userId) {
        ResponseEntity<List<AssetResponse>> response = getAssets();

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody().stream()
                           .filter(asset -> asset.createdBy().equals(userId))
                           .toList();
        }

        log.warn("Failed to retrieve assets for userId: {}", userId);
        return List.of();
    }

    private static ResponseEntity<S3Response> getS3ResponseEntity(ResponseEntity<S3Response> response) {
        S3Response body = response.getBody();

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error(FEIGN_CALL_FAILED, response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode())
                                 .body(body);
        }

        if (body != null && body.URL() != null) {
            return ResponseEntity.ok().body(body);
        }

        return ResponseEntity.status(500).body(body);
    }


}
