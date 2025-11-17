package com.app.nexio.notification.client;

import com.app.nexio.notification.client.dto.UpsertNotification;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service",
             url = "${client.notification.url}")
public interface NotificationClient {

    @PostMapping("/registration")
    ResponseEntity<Void> notification(@RequestBody UpsertNotification notification);

    @PostMapping("/posted-item")
    ResponseEntity<Void> notifyPostedItem(@RequestBody UpsertNotification notification);

}
