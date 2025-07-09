package com.synexiai.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderNotificationDto {
    private String email;
    private String skuCode;
    private int quantity;
}
