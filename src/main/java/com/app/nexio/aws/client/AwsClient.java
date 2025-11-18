package com.app.nexio.aws.client;

import com.app.nexio.aws.client.dto.AssetResponse;
import com.app.nexio.aws.client.dto.S3Response;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "aws-s3-svc",
             url = "${client.aws.url}")
public interface AwsClient {

    @PostMapping(value = "/upload",
                 produces = {"application/json"},
                 consumes = {"multipart/form-data"})
    @Headers("Content-Type: multipart/form-data")
    ResponseEntity<S3Response> upsertProfilePicture(@RequestParam("user_id") UUID userId,
                                                    @RequestPart("file") MultipartFile file);


    @PostMapping(value = "/upload/item",
                 produces = {"application/json"},
                 consumes = {"multipart/form-data"})
    @Headers("Content-Type: multipart/form-data")
    ResponseEntity<S3Response> upsertItemPictures(@RequestParam("item_id") UUID itemId,
                                                  @RequestParam("user_id") UUID userId,
                                                  @RequestPart("file") MultipartFile file);

    @GetMapping(value = "/assets",
                produces = {"application/json"})
    ResponseEntity<List<AssetResponse>> getAssets();

}
