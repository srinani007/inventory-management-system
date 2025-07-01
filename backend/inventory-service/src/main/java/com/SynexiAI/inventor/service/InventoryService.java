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
}
