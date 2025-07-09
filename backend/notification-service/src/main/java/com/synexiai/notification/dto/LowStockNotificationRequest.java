package com.synexiai.notification.dto;

import lombok.Data;

@Data
public class LowStockNotificationRequest {
    private String skuCode;
    private int quantityAvailable;
    private int reorderLevel;
    private String itemName;
    private String email; // can be static too
}
