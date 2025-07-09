package com.synexiai.notification.consumer;

import com.synexiai.notification.config.RabbitMQConfig;
import com.synexiai.notification.dto.OrderNotificationEvent;
import com.synexiai.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderNotificationListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_NOTIFICATION_QUEUE)
    public void consumeNotification(OrderNotificationEvent event) {
        log.info("📩 Received notification event for email: {}", event.getToEmail());
        try {
            emailService.sendOrderConfirmation(event.getToEmail(), event.getUserName(), event.getSkuCode(), event.getQuantity());
        } catch (Exception e) {
            log.error("❌ Failed to process email notification: {}", e.getMessage(), e);
            // 🚨 This prevents the infinite retry loop!
        }
    }
}
