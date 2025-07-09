package com.synexiai.order.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.synexiai.order.dto.*;
import com.synexiai.order.model.Order;
import com.synexiai.order.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final RestTemplate restTemplate;
    private final HttpServletRequest httpRequest;
    private final RabbitMQPublisher publisher;
    private final ObjectMapper objectMapper;



    // ✅ Place a new order
    public OrderResponseDto placeOrder(OrderRequestDto dto) {
        Order order = Order.builder()
                .skuCode(dto.getSkuCode())
                .quantity(dto.getQuantity())
                .status("PENDING")
                .placedBy(dto.getPlacedBy())
                .placedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepo.save(order);

        try {
            // 🔐 Extract JWT token from request
            String token = httpRequest.getHeader("Authorization");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", token);

            // 📉 Request inventory deduction
            InventoryDeductRequest deductRequest = new InventoryDeductRequest(dto.getSkuCode(), dto.getQuantity());
            HttpEntity<InventoryDeductRequest> requestEntity = new HttpEntity<>(deductRequest, headers);

            ResponseEntity<Void> response = restTemplate.exchange(
                    "http://localhost:8082/api/inventory/deduct",
                    HttpMethod.POST,
                    requestEntity,
                    Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                savedOrder.setStatus("CONFIRMED");

                // 📩 Get user email from user-service
                String toEmail = getEmailForUser(dto.getPlacedBy(), token);

                // 📢 Send notification to queue
                OrderNotificationEvent event = new OrderNotificationEvent(
                        toEmail,
                        dto.getPlacedBy(),
                        dto.getSkuCode(),
                        dto.getQuantity()
                );
                publisher.sendNotification(event);
                System.out.println("📨 Notification sent for order confirmation");
            } else {
                savedOrder.setStatus("FAILED");
                System.err.println("❌ Inventory deduction failed");
            }

        } catch (Exception e) {
            savedOrder.setStatus("FAILED");
            System.err.println("❌ Order processing failed: " + e.getMessage());
            e.printStackTrace();
        }

        Order finalOrder = orderRepo.save(savedOrder);
        return toDto(finalOrder);
    }

    public Page<OrderResponseDto> listOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepo.findAll(pageable);

        List<OrderResponseDto> dtoList = orderPage.getContent()
                .stream()
                .map(this::toDto)
                .toList();

        return new PageImpl<>(dtoList, pageable, orderPage.getTotalElements());
    }

    // ✅ Get order by ID
    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return toDto(order);
    }

    // ✅ Update existing order
    public OrderResponseDto updateOrder(Long id, OrderRequestDto dto) {
        Order existingOrder = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        existingOrder.setSkuCode(dto.getSkuCode());
        existingOrder.setQuantity(dto.getQuantity());
        existingOrder.setPlacedBy(dto.getPlacedBy());
        // Optional: Decide if `status` and `placedAt` should be updated

        Order updatedOrder = orderRepo.save(existingOrder);
        return toDto(updatedOrder);
    }

    // ✅ Delete an order
    public void deleteOrder(Long id) {
        if (!orderRepo.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepo.deleteById(id);
    }

    // 🔍 Helper method to convert entity to DTO
    private OrderResponseDto toDto(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .skuCode(order.getSkuCode())
                .quantity(order.getQuantity())
                .status(order.getStatus())
                .placedBy(order.getPlacedBy())
                .placedAt(order.getPlacedAt())
                .build();
    }

    // 📧 Helper to call user-service for email by username
    private String getEmailForUser(String username, String token) {
        try {
            String url = "http://localhost:8081/api/auth/email/" + username;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                System.err.println("⚠️ Could not retrieve email: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to fetch user email: " + e.getMessage());
        }

        return username + "@fallback.com";
    }

    private InventoryItemDto fetchInventoryBySku(String skuCode, String token) {
        try {
            String url = "http://localhost:8082/api/inventory/sku/" + skuCode;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Object> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, Object.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                LinkedHashMap<String, Object> raw = (LinkedHashMap<String, Object>) response.getBody();
                return objectMapper.convertValue(raw, InventoryItemDto.class);
            } else {
                System.err.println("⚠️ Inventory fetch failed: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to fetch inventory item for SKU: " + skuCode);
            e.printStackTrace();
        }

        return null; // Fallback if fail
    }

}
