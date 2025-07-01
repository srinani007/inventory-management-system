// InventoryServiceTest.java
package com.SynexiAI.inventor.inventory_service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import com.SynexiAI.inventor.model.InventoryItem;
import com.SynexiAI.inventor.repository.InventoryRepository;
import com.SynexiAI.inventor.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private InventoryItem item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        item = new InventoryItem();
        item.setId(1L);
        item.setName("Test Item");
    }

    @Test
    void testGetItemById() {
        when(inventoryRepository.findById(1L)).thenReturn(Optional.of(item));

        InventoryItem found = inventoryService.getItemById(1L);

        assertNotNull(found);
        assertEquals("Test Item", found.getName());
    }

    @Test
    void testAddItem() {
        when(inventoryRepository.save(any(InventoryItem.class))).thenReturn(item);

        InventoryItem saved = inventoryService.addItem(item);

        assertNotNull(saved);
        assertEquals("Test Item", saved.getName());
    }

    @Test
    void testDeleteItem() {
        inventoryService.deleteItem(1L);

        verify(inventoryRepository, times(1)).deleteById(1L);
    }
}
