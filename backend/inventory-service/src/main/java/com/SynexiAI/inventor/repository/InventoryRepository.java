package com.SynexiAI.inventor.repository;

import com.SynexiAI.inventor.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findBySkuCode(String skuCode);

    // Additional methods can be added as required
}
