package com.app.nexio.aws.client;

import com.app.nexio.aws.client.dto.AwsUserDetails;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "aws-s3-svc",
             url = "${client.aws.url}")
public interface AwsClient {

    @PostMapping(value = "/upload",
                 produces = {"application/json"},
                 consumes = {"multipart/form-data"})
    ResponseEntity<?> upsertProfilePicture(@RequestParam String userId, @RequestPart(value = "file") MultipartFile file);


}
