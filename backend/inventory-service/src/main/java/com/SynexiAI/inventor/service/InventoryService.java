package com.SynexiAI.inventor.service;

import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.dto.NotificationRequest;
import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    @Autowired
    private InventoryMappingService mapper;

    @Autowired
    private RestTemplate restTemplate;


    public List<InventoryItemDto> getAllItems() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public InventoryItemDto getItem(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public InventoryItemDto createItem(InventoryItemDto dto) {
        InventoryItem saved = repository.save(mapper.toEntity(dto));
        return mapper.toDto(saved);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    public InventoryItem getItemById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public InventoryItem addItem(InventoryItem item) {
        return repository.save(item);
    }

    public InventoryItemDto updateItem(Long id, 
                                       InventoryItemDto dto) {
        InventoryItem existingItem = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        existingItem.setName(dto.getName());
        existingItem.setSkuCode(dto.getSkuCode());
        existingItem.setQuantityAvailable(dto.getQuantityAvailable());
        existingItem.setQuantityReserved(dto.getQuantityReserved());
        existingItem.setReorderLevel(dto.getReorderLevel());
        existingItem.setLocation(dto.getLocation());
        existingItem.setExpiryDate(dto.getExpiryDate());

        InventoryItem updatedItem = repository.save(existingItem);
        return mapper.toDto(updatedItem);
    }

    public InventoryItemDto getItemBySkuCode(String skuCode) {
        InventoryItem item = repository.findBySkuCode(skuCode)
                .orElseThrow(() -> new RuntimeException("Item not found with SKU code: " + skuCode));
        return mapper.toDto(item);
    }

    public boolean deductStock(String skuCode, int quantity) {
        Optional<InventoryItem> optionalItem = repository.findBySkuCode(skuCode);

        if (optionalItem.isPresent()) {
            InventoryItem item = optionalItem.get();

            // 🛡️ Null-safe default values
            int available = item.getQuantityAvailable() != null ? item.getQuantityAvailable() : 0;
            int reorder = item.getReorderLevel() != null ? item.getReorderLevel() : 0;

            if (available >= quantity) {
                int updatedQty = available - quantity;
                item.setQuantityAvailable(updatedQty);
                repository.save(item);

                // 🚨 Trigger notification if now below reorder level
                if (updatedQty < reorder) {
                    NotificationRequest alert = new NotificationRequest(
                            "LOW_STOCK",
                            "⚠️ Inventory low for SKU: " + item.getSkuCode()
                                    + " | Available: " + updatedQty
                                    + " | Reorder Level: " + reorder,
                            "slack-inventory-alerts"
                    );

                    try {
                        restTemplate.postForEntity("http://localhost:8084/api/notify/email", alert, Void.class);
                        System.out.println("🔔 Notification triggered for low stock!");
                    } catch (Exception e) {
                        System.err.println("❌ Failed to send notification: " + e.getMessage());
                    }
                }

                return true;
            } else {
                System.err.println("❌ Not enough stock for SKU: " + skuCode + " | Requested: " + quantity + " | Available: " + available);
            }
        } else {
            System.err.println("❌ SKU not found: " + skuCode);
        }

        return false;
    }

}
