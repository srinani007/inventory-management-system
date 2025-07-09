package com.synexiai.order.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skuCode;

    private Integer quantity;

    private String status; // PENDING, CONFIRMED, CANCELLED

    private String placedBy; // optional: username/email/id

    private LocalDateTime placedAt;
}
