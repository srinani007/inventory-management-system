package com.synexiai.order.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDeductRequest {
    private String skuCode;
    private int quantity;
}
