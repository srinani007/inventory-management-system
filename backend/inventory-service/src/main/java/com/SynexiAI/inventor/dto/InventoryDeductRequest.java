package com.SynexiAI.inventor.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDeductRequest {
    private String skuCode;
    private int quantity;
}
