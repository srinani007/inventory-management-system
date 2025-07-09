package com.synexiai.order.service;

import com.synexiai.order.dto.OrderRequestDto;
import com.synexiai.order.dto.OrderResponseDto;
import com.synexiai.order.model.Order;
import com.synexiai.order.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepo;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private RabbitMQPublisher publisher;

    @Mock
    private HttpServletRequest httpRequest;

    @BeforeEach
    void setUp() {
        // Not needed if using @ExtendWith(MockitoExtension.class)
        // MockitoAnnotations.openMocks(this);
    }

    @Test
    void placeOrder_successfulFlow_shouldReturnConfirmedOrder() {
        OrderRequestDto request = new OrderRequestDto("TEST123", 2, "nani123");

        when(orderRepo.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(httpRequest.getHeader("Authorization")).thenReturn("Bearer test-token");

        when(restTemplate.exchange(
                eq("http://localhost:8082/api/inventory/deduct"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Void.class)
        )).thenReturn(new ResponseEntity<>(HttpStatus.OK));

        when(restTemplate.exchange(
                eq("http://localhost:8081/api/auth/email/nani123"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(String.class)
        )).thenReturn(new ResponseEntity<>("test@example.com", HttpStatus.OK));

        OrderResponseDto result = orderService.placeOrder(request);

        assertEquals("CONFIRMED", result.getStatus());
        verify(publisher).sendNotification(any());
        verify(orderRepo, times(2)).save(any(Order.class));
    }

    @Test
    void placeOrder_inventoryFails_shouldSetStatusFailed() {
        OrderRequestDto request = new OrderRequestDto("SKUFAIL", 1, "failUser");

        when(orderRepo.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(httpRequest.getHeader("Authorization")).thenReturn("Bearer fail-token");

        when(restTemplate.exchange(
                eq("http://localhost:8082/api/inventory/deduct"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Void.class)
        )).thenReturn(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

        OrderResponseDto result = orderService.placeOrder(request);

        assertEquals("FAILED", result.getStatus());
        verify(orderRepo, times(2)).save(any(Order.class));
    }

    @Test
    void getOrderById_validId_shouldReturnOrder() {
        Order order = Order.builder().id(1L).skuCode("SKU1").quantity(3).status("CONFIRMED").placedBy("user").placedAt(LocalDateTime.now()).build();
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderResponseDto result = orderService.getOrderById(1L);

        assertEquals("SKU1", result.getSkuCode());
        assertEquals(3, result.getQuantity());
    }

    @Test
    void getOrderById_invalidId_shouldThrowException() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            orderService.getOrderById(99L);
        });

        assertTrue(ex.getMessage().contains("Order not found"));
    }

    @Test
    void updateOrder_validId_shouldUpdateAndReturnUpdatedOrder() {
        Order existing = Order.builder().id(1L).skuCode("OLD123").quantity(1).status("CONFIRMED").placedBy("oldUser").placedAt(LocalDateTime.now()).build();
        OrderRequestDto updateDto = new OrderRequestDto("NEW456", 10, "newUser");

        when(orderRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(orderRepo.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponseDto result = orderService.updateOrder(1L, updateDto);

        assertEquals("NEW456", result.getSkuCode());
        assertEquals(10, result.getQuantity());
        assertEquals("newUser", result.getPlacedBy());
    }

    @Test
    void updateOrder_invalidId_shouldThrow() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            orderService.updateOrder(99L, new OrderRequestDto("SKU", 1, "user"));
        });

        assertTrue(ex.getMessage().contains("Order not found"));
    }

    @Test
    void deleteOrder_exists_shouldDelete() {
        when(orderRepo.existsById(1L)).thenReturn(true);
        orderService.deleteOrder(1L);
        verify(orderRepo).deleteById(1L);
    }

    @Test
    void deleteOrder_notExists_shouldThrow() {
        when(orderRepo.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            orderService.deleteOrder(99L);
        });

        assertTrue(ex.getMessage().contains("Order not found"));
    }

    @Test
    void getAllOrders_withPagination_shouldReturnPageOfOrderDtos() {
        Pageable pageable = PageRequest.of(0, 2, Sort.by("placedAt").descending());

        Order order1 = Order.builder().id(1L).skuCode("ITEM001").quantity(2).status("CONFIRMED").placedBy("user1").placedAt(LocalDateTime.now()).build();
        Order order2 = Order.builder().id(2L).skuCode("ITEM002").quantity(1).status("FAILED").placedBy("user2").placedAt(LocalDateTime.now().minusDays(1)).build();

        Page<Order> mockOrderPage = new PageImpl<>(List.of(order1, order2), pageable, 2);
        when(orderRepo.findAll(pageable)).thenReturn(mockOrderPage);

        Page<OrderResponseDto> result = orderService.listOrders(pageable);

        assertEquals(2, result.getContent().size());
        assertEquals("ITEM001", result.getContent().get(0).getSkuCode());
        assertEquals("CONFIRMED", result.getContent().get(0).getStatus());

        assertEquals("ITEM002", result.getContent().get(1).getSkuCode());
        assertEquals("FAILED", result.getContent().get(1).getStatus());

        verify(orderRepo).findAll(pageable);
    }
}
