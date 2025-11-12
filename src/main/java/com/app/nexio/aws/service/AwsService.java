package com.app.nexio.aws.service;

import com.app.nexio.aws.client.AwsClient;
import com.app.nexio.aws.client.dto.S3FileResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
public class AwsService {

    private final AwsClient awsClient;


    @Autowired
    public AwsService(AwsClient awsClient) {
        this.awsClient = awsClient;
    }

    public ResponseEntity<S3FileResponse> sendAwsFile(UUID userId, MultipartFile file) {

        ResponseEntity<S3FileResponse> response = awsClient.upsertProfilePicture(userId, file);
        S3FileResponse body = response.getBody();

        if(!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to AWS-S3-SVC failed due to {}", response.getStatusCode());
            return ResponseEntity.status(response.getStatusCode())
                                 .body(body);
        }

        if (body != null && body.getURL() != null) {
            return ResponseEntity.ok().body(body);
        }

        return ResponseEntity.status(500).body(body);
    }


}
