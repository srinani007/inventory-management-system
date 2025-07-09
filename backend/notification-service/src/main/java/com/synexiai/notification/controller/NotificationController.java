package com.synexiai.notification.controller;

import com.synexiai.notification.dto.LowStockNotificationRequest;
import com.synexiai.notification.dto.OrderNotificationDto;
import com.synexiai.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/low-stock")
    public ResponseEntity<String> sendLowStockAlert(@RequestBody LowStockNotificationRequest request) {
        emailService.sendLowStockAlert(request);
        return ResponseEntity.ok("Email sent successfully");
    }

    @PostMapping("/order")
    public ResponseEntity<String> sendOrderMail(@RequestBody OrderNotificationDto dto) {
        emailService.sendOrderConfirmation(
                dto.getEmail(),          // ✅ toEmail
                dto.getUserName(),       // ✅ userName (new)
                dto.getSkuCode(),        // ✅ skuCode
                dto.getQuantity()        // ✅ quantity
        );
        return ResponseEntity.ok("Order confirmation email sent!");
    }
}
