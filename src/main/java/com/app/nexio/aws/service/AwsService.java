package com.app.nexio.aws.service;

import com.app.nexio.aws.client.AwsClient;
import com.app.nexio.aws.client.dto.AwsUserDetails;
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

    public ResponseEntity<String> sendAwsFile(UUID userId, MultipartFile file) {
        AwsUserDetails details = AwsUserDetails.builder()
                                               .userId(userId)
                                               .file(file)
                                               .build();

        ResponseEntity<?> response = awsClient.upsertProfilePicture(String.valueOf(userId), file);

        if(!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to AWS-S3-SVC failed due to {}", response.getStatusCode());
        }

        Object body = response.getBody();

        return null;
    }


}
