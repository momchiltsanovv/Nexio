package com.app.nexio.notification.service;

import com.app.nexio.notification.client.NotificationClient;
import com.app.nexio.notification.client.dto.UpsertNotification;
import com.app.nexio.utils.EmailNotificationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class NotificationService {

    private final NotificationClient notificationClient;

    @Autowired
    public NotificationService(NotificationClient notificationClient) {
        this.notificationClient = notificationClient;
    }


    public void sendNotificationWhenRegister(UUID userId, String contactInfo) {
        UpsertNotification notification = UpsertNotification.builder()
                                                            .userId(userId)
                                                            .contactInfo(contactInfo)
                                                            .type(EmailNotificationUtils.EMAIL)
                                                            .subject(EmailNotificationUtils.CREATED_ACCOUNT_SUBJECT)
                                                            .body(EmailNotificationUtils.getRegistrationBody())
                                                            .build();

        ResponseEntity<Void> response = notificationClient.notification(notification);

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to notification failed due to {}, can`t send successful registration email to user with id {}",
                      response.getStatusCode(),
                      userId);
        }

    }

    public void sendNotificationWhenItemPosted(UUID userId, String contactInfo, String itemName) {
        UpsertNotification notification = UpsertNotification.builder()
                                                            .userId(userId)
                                                            .contactInfo(contactInfo)
                                                            .type(EmailNotificationUtils.EMAIL)
                                                            .subject(EmailNotificationUtils.ITEM_POSTED_SUBJECT)
                                                            .body(EmailNotificationUtils.getItemPostedBody(itemName))
                                                            .build();

        ResponseEntity<Void> response = notificationClient.notifyPostedItem(notification);

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to notification failed due to {}, can't send item posted email to user with id {}",
                      response.getStatusCode(),
                      userId);
        }
    }
}
