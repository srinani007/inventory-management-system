package com.SynexiAI.inventor.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String type;       // e.g. "LOW_STOCK"
    private String message;    // Detailed message
    private String recipient;  // E.g. slack-channel-name or email
}
