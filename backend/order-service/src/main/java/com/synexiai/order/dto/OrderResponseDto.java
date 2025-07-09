package com.synexiai.order.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {

    private Long id;

    private String skuCode;

    private int quantity;

    private String status;

    private String placedBy;

    private LocalDateTime placedAt;
}
