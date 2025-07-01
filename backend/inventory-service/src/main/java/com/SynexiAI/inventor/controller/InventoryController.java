package com.SynexiAI.inventor.controller;

import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import com.SynexiAI.inventor.service.InventoryMappingService;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {
    private final InventoryRepository repo;
    private final InventoryMappingService mappingService;

    public InventoryController(InventoryRepository repo,
                               InventoryMappingService mappingService) {
        this.repo = repo;
        this.mappingService = mappingService;
    }


    @Cacheable("inventoryAll")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','WAREHOUSE_STAFF')")
    public List<InventoryItemDto> listAll() {
        return repo.findAll()
                .stream()
                .map(mappingService::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public InventoryItemDto create(@Valid @RequestBody InventoryItemDto dto) {
        InventoryItem entity = mappingService.toEntity(dto);
        InventoryItem saved = repo.save(entity);
        return mappingService.toDto(saved);
    }

    @Cacheable(value = "inventory", key = "#id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','WAREHOUSE_STAFF')")
    public InventoryItemDto getOne(@PathVariable Long id) {
        InventoryItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return mappingService.toDto(item);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public InventoryItemDto update(
            @PathVariable Long id,
            @Valid @RequestBody InventoryItemDto dto) {

        InventoryItem existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        // copy fields (or use mapping service)
        existing.setSkuCode(dto.getSkuCode());
        existing.setName(dto.getName());
        existing.setQuantityAvailable(dto.getQuantityAvailable());
        // … other fields …
        InventoryItem saved = repo.save(existing);
        return mappingService.toDto(saved);
    }
}
