package com.synexiai.notification.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String type;       // e.g., "LOW_STOCK", "ORDER_FAILED"
    private String message;    // What message to show
    private String recipient;  // email or "slack-channel-name"
}
