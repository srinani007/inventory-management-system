package com.synexiai.notification.service;

import com.synexiai.notification.dto.LowStockNotificationRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;

    public void sendLowStockAlert(LowStockNotificationRequest request) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(request.getEmail());
            helper.setSubject("⚠️ Low Stock Alert: " + request.getItemName());

            String htmlContent = """
            <div style="font-family: Arial, sans-serif; background-color: #fff3e0; padding: 25px; border-left: 6px solid #ff9800; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.05);">
                <div style="text-align: center;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2784/2784445.png" width="80" alt="Low Stock" style="margin-bottom: 20px;" />
                    <h2 style="color: #e65100;">⚠️ Low Stock Warning</h2>
                </div>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">
                    The following item is now <strong>below reorder level</strong> in the inventory:
                </p>
                <div style="background-color: #fff8e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>📦 Item:</strong> %s</p>
                    <p><strong>🔢 SKU Code:</strong> %s</p>
                    <p><strong>📉 Available:</strong> %d</p>
                    <p><strong>📈 Reorder Level:</strong> %d</p>
                </div>
                <p style="font-size: 14px; color: #555;">Please take action to restock this item immediately.</p>
                <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">© 2025 SynexiAI System</p>
            </div>
        """.formatted(request.getItemName(), request.getSkuCode(), request.getQuantityAvailable(), request.getReorderLevel());

            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            System.out.println("📨 Low stock alert email sent!");

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send low stock email: " + e.getMessage());
        }
    }


    public void sendOrderConfirmation(String toEmail, String userName, String skuCode, int quantity) {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Set email metadata
            helper.setTo(toEmail);
            helper.setFrom("noreply@synexiaiai.com", "SynexiAI Inventory");
            helper.setSubject("✅ Your Order #" + skuCode + " is Confirmed");
            helper.setPriority(1); // High priority

            // Prepare template context
            Context context = new Context();
            context.setVariable("userName", userName);
            context.setVariable("skuCode", skuCode);
            context.setVariable("quantity", quantity);
            context.setVariable("toEmail", toEmail); // For footer display

            // Process template
            String htmlContent = templateEngine.process("order-confirmation.html", context);

            // Set email content
            helper.setText(htmlContent, true);

            // Add logo as inline image
            ClassPathResource resource = new ClassPathResource("static/images/logo.png");
            helper.addInline("logo", resource);

            // Send email
            mailSender.send(mimeMessage);

            // Log success
            log.info("📨 Order confirmation email sent to {} for order {}", toEmail, skuCode);

        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("❌ Failed to send confirmation email to {}: {}", toEmail, e.getMessage());
            // Consider adding retry logic or dead letter queue here
        }
    }

}
