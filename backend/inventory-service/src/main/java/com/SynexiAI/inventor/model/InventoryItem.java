package com.SynexiAI.inventor.model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;

@Data
@Entity
@Table(name = "inventory_items")
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String skuCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer quantityAvailable;

    private Integer quantityReserved = 0;
    private Integer reorderLevel    = 0;
    private String location;
    private LocalDate expiryDate;

}