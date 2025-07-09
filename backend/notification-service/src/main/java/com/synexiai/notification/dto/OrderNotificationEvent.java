package com.synexiai.notification.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotificationEvent implements Serializable {

    private String toEmail;
    private String userName;
    private String skuCode;
    private int quantity;
}