package com.synexiai.notification.service;

import com.synexiai.notification.dto.NotificationRequest;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void send(NotificationRequest request) {
        // TEMP: Print to console (Later: Slack/Email)
        System.out.println("🔔 Notification Received:");
        System.out.println("Type: " + request.getType());
        System.out.println("To: " + request.getRecipient());
        System.out.println("Message: " + request.getMessage());
    }
}
