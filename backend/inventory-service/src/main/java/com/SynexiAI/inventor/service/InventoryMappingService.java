package com.SynexiAI.inventor.service;

import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.model.InventoryItem;
import org.springframework.stereotype.Component;

@Component
public class InventoryMappingService {

    public InventoryItemDto toDto(InventoryItem entity) {
        InventoryItemDto dto = new InventoryItemDto();
        dto.setId(entity.getId());
        dto.setSkuCode(entity.getSkuCode());
        dto.setName(entity.getName());
        dto.setQuantityAvailable(entity.getQuantityAvailable());
        dto.setQuantityReserved(entity.getQuantityReserved());
        dto.setReorderLevel(entity.getReorderLevel());
        dto.setLocation(entity.getLocation());
        dto.setExpiryDate(entity.getExpiryDate());
        return dto;
    }

    public InventoryItem toEntity(InventoryItemDto dto) {
        InventoryItem item = new InventoryItem();
        item.setSkuCode(dto.getSkuCode());
        item.setName(dto.getName());
        item.setQuantityAvailable(dto.getQuantityAvailable());
        item.setQuantityReserved(dto.getQuantityReserved());
        item.setReorderLevel(dto.getReorderLevel());
        item.setLocation(dto.getLocation());
        item.setExpiryDate(dto.getExpiryDate());
        return item;
    }
}
