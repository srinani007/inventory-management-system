package com.synexiai.order.service;

import com.synexiai.order.config.RabbitMQConfig;
import com.synexiai.order.dto.OrderNotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQPublisher {

    private final AmqpTemplate rabbitTemplate;

    public void sendNotification(OrderNotificationEvent event) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.ORDER_NOTIFICATION_QUEUE, event);
    }
}
