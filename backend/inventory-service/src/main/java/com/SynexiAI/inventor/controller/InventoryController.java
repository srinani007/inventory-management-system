package com.SynexiAI.inventor.controller;

import com.SynexiAI.inventor.dto.InventoryDeductRequest;
import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.exception.ItemNotFoundException;
import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import com.SynexiAI.inventor.service.InventoryMappingService;
import com.SynexiAI.inventor.service.InventoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Inventory API", description = "Manage inventory items")
public class InventoryController {
    private final InventoryRepository repo;
    private final InventoryMappingService mappingService;

    @Autowired
    private InventoryService inventoryService;

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
    @CacheEvict(value = "inventoryAll", allEntries = true)
    public InventoryItemDto create(@Valid @RequestBody InventoryItemDto dto) {
        InventoryItem entity = mappingService.toEntity(dto);
        InventoryItem saved = repo.save(entity);
        return mappingService.toDto(saved);
    }

    //@Cacheable(value = "inventory", key = "#id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','WAREHOUSE_STAFF')")
    public InventoryItemDto getOne(@PathVariable Long id) {

        InventoryItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return mappingService.toDto(item);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @CacheEvict(value = "inventoryAll", allEntries = true)
    public InventoryItemDto update(
            @PathVariable Long id,
            @Valid @RequestBody InventoryItemDto dto) {

        InventoryItem existing = repo.findById(id)
                .orElseThrow(() ->  new ItemNotFoundException("Item not found with ID: " + id));
        // copy fields (or use mapping service)
        existing.setSkuCode(dto.getSkuCode());
        existing.setName(dto.getName());
        existing.setQuantityAvailable(dto.getQuantityAvailable());
        existing.setQuantityReserved(dto.getQuantityReserved());
        existing.setReorderLevel(dto.getReorderLevel());
        existing.setLocation(dto.getLocation());
        existing.setExpiryDate(dto.getExpiryDate());
        // … other fields …
        InventoryItem saved = repo.save(existing);
        return mappingService.toDto(saved);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }


    @GetMapping("/sku/{skuCode}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','WAREHOUSE_STAFF')")
    @CacheEvict(value = "inventoryAll", allEntries = true)
    public InventoryItemDto getBySkuCode(@PathVariable String skuCode) {
        InventoryItem item = repo.findBySkuCode(skuCode)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with SKU code: " + skuCode));
        return mappingService.toDto(item);
    }

    @PostMapping("/deduct")
    //@PreAuthorize("hasAnyRole('ADMIN','MANAGER','WAREHOUSE_STAFF')")
    public ResponseEntity<Void> deductInventory(@RequestBody InventoryDeductRequest request) {
        boolean success = inventoryService.deductStock(request.getSkuCode(), request.getQuantity());
        return success ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

}
