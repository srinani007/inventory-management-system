package com.synexiai.order.controller;

import com.synexiai.order.dto.OrderRequestDto;
import com.synexiai.order.dto.OrderResponseDto;
import com.synexiai.order.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Order API", description = "Handles order placement and tracking")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place new order
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF')")
    public OrderResponseDto placeOrder(@Valid @RequestBody OrderRequestDto orderDto) {
        return orderService.placeOrder(orderDto);
    }


    // ✅ Get order by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // ✅ Update order
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponseDto updateOrder(@PathVariable Long id, @Valid @RequestBody OrderRequestDto dto) {
        return orderService.updateOrder(id, dto);
    }

    // ✅ Delete order
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    // ✅ List orders with pagination
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public Page<OrderResponseDto> listOrders(
            @PageableDefault(size = 10, sort = "placedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return orderService.listOrders(pageable);
    }



}
