package com.SynexiAI.inventor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Data
public class InventoryItemDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;

    @NotBlank(message = "SKU code is required")
    private String skuCode;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Quantity available is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer reorderLevel;
    private String location;
    private LocalDate expiryDate;


}
