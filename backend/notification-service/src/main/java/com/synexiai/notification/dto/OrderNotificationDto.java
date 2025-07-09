package com.synexiai.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotificationDto {
    private String email;
    private String skuCode;
    private int quantity;
    private String userName;
}
