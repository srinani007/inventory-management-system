package com.SynexiAI.inventor.service;

import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    @Autowired
    private InventoryMappingService mapper;

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

    public InventoryItemDto updateItem(Long id, InventoryItemDto dto) {
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

}
