package com.synexiai.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItemDto implements Serializable {
    private Long id;
    private String name;
    private String skuCode;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer reorderLevel;
    private String location;
    private LocalDate expiryDate;
}
