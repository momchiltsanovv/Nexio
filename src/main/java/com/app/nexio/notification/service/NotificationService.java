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
    public static final String CREATED_ACCOUNT = "Successfully created account";
    public static final String BODY = "Thank You for Joining Us!\n" +
            "We are thrilled to welcome you to our platform! Your registration was successful, and we're excited to have you on board.\n" +
            "Feel free to customize it further to match your platform's tone and style!";

    private final NotificationClient notificationClient;

    @Autowired
    public NotificationService(NotificationClient notificationClient) {
        this.notificationClient = notificationClient;
    }


    public void sendNotificationWhenRegister(UUID userId, String contactInfo) {
        UpsertNotification notification = UpsertNotification.builder()
                                                            .userId(userId)
                                                            .contactInfo(contactInfo)
                                                            .type(EMAIL)
                                                            .subject(CREATED_ACCOUNT)
                                                            .body(BODY)
                                                            .build();

        ResponseEntity<Void> response = notificationClient.notification(notification);

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("Feign call to notification failed due to {}, can`t send successful registration email to user with id {}",
                      response.getStatusCode(),
                      userId);
        }

    }
}
