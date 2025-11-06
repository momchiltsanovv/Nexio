package com.app.nexio.notification.client;

import com.app.nexio.notification.client.dto.UpsertNotification;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-svc",
             url = "http://localhost:8081/api/v1/notifications")
public interface NotificationClient {

    @PostMapping("/registration")
    ResponseEntity<Void> notification(@RequestBody UpsertNotification notification);

}
