package com.app.nexio.notification.service;

import com.app.nexio.notification.client.NotificationClient;
import com.app.nexio.notification.client.dto.UpsertNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class NotificationService {

    public static final String EMAIL = "EMAIL";
    private final NotificationClient notificationClient;

    //TODO figure out why is this raising -> Could not autowire. No beans of 'NotificationClient' type found.
    @Autowired
    public NotificationService(NotificationClient notificationClient) {
        this.notificationClient = notificationClient;
    }


    public void sendNotificationWhenRegister(UUID userId, String contactInfo) {
        UpsertNotification notification = UpsertNotification.builder()
                                                            .userId(userId)
                                                            .contactInfo(contactInfo)
                                                            .type(EMAIL)
                                                            .build();

        ResponseEntity<Void> response = notificationClient.upsertNotification(notification);

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to notification failed due to {}, can`t send successful registration email to user with id {}",
                      response.getStatusCode(),
                      userId);
        }

    }
}
