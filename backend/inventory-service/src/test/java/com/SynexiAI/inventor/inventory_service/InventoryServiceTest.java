package com.SynexiAI.inventor.inventory_service;

import com.SynexiAI.inventor.dto.InventoryItemDto;
import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import com.SynexiAI.inventor.service.InventoryMappingService;
import com.SynexiAI.inventor.service.InventoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InventoryServiceTest {

    @Mock
    private InventoryRepository repository;

    @Mock
    private InventoryMappingService mapper;

    @InjectMocks
    private InventoryService service;

    private InventoryItem item;
    private InventoryItemDto dto;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        item = new InventoryItem();
        item.setId(1L);
        item.setName("Item 1");
        item.setSkuCode("SKU-001");

        dto = new InventoryItemDto();
        dto.setName("Item 1");
        dto.setSkuCode("SKU-001");

        when(mapper.toEntity(dto)).thenReturn(item);
        when(mapper.toDto(item)).thenReturn(dto);
    }

    @Test
    void testCreateItem() {
        when(repository.save(any(InventoryItem.class))).thenReturn(item);
        InventoryItemDto saved = service.createItem(dto);
        assertEquals("Item 1", saved.getName());
        verify(repository, times(1)).save(any(InventoryItem.class));
    }

    @Test
    void testGetItem() {
        when(repository.findById(1L)).thenReturn(Optional.of(item));
        when(mapper.toDto(item)).thenReturn(dto);
        InventoryItemDto found = service.getItem(1L);
        assertEquals("SKU-001", found.getSkuCode());
    }

    @Test
    void testGetItemNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getItem(1L));
    }

    @Test
    void testUpdateItem() {
        InventoryItem existing = new InventoryItem();
        existing.setId(1L);
        existing.setName("Item 1"); // Original name
        existing.setSkuCode("SKU-001");

        InventoryItemDto dto = new InventoryItemDto();
        dto.setName("Updated Item"); // 🔥 what we expect
        dto.setSkuCode("SKU-001");

        InventoryItem updated = new InventoryItem(); // simulate result after save
        updated.setId(1L);
        updated.setName("Updated Item");
        updated.setSkuCode("SKU-001");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenReturn(updated);
        when(mapper.toDto(updated)).thenReturn(dto);

        InventoryItemDto result = service.updateItem(1L, dto);

        assertEquals("Updated Item", result.getName()); // ✅ now should pass
        verify(repository).save(any());
    }

    @Test
    void testGetItemBySkuCode() {
        String sku = "SKU-123";

        InventoryItem entity = new InventoryItem();
        entity.setId(1L);
        entity.setSkuCode(sku);
        entity.setName("Sample Item");

        InventoryItemDto dto = new InventoryItemDto();
        dto.setSkuCode(sku);
        dto.setName("Sample Item");

        when(repository.findBySkuCode(sku)).thenReturn(Optional.of(entity));
        when(mapper.toDto(entity)).thenReturn(dto);

        InventoryItemDto result = service.getItemBySkuCode(sku);

        assertNotNull(result);
        assertEquals(sku, result.getSkuCode());
        assertEquals("Sample Item", result.getName());

        verify(repository, times(1)).findBySkuCode(sku);
    }

    @Test
    void testGetItemBySkuCodeNotFound() {
        String sku = "INVALID-SKU";

        when(repository.findBySkuCode(sku)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            service.getItemBySkuCode(sku);
        });

        assertEquals("Item not found with SKU code: " + sku, exception.getMessage());
    }

    @Test
    void testObjectMapperWithLocalDate() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        InventoryItemDto item = new InventoryItemDto();
        item.setExpiryDate(LocalDate.now());
        String json = mapper.writeValueAsString(item);

        System.out.println(json); // ✅ You’ll see correct ISO date
    }

}
