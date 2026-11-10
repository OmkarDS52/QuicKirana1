package com.example.Kirana.Service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.example.Kirana.Entity.Notification;
import com.example.Kirana.Entity.Order;
import com.example.Kirana.Entity.User;
import com.example.Kirana.Repository.NotificationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Create notification manually
    public void createNotification(User user, Order order, String title, String body) {
        Notification notification = Notification.builder()
                .user(user)
                .order(order)
                .title(title)
                .body(body)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    // Auto notification based on order status
    public void notifyOrderStatus(Order order) {
        User customer = order.getCustomer();
        String shopName = order.getShop().getName();
        String title;
        String body;

        switch (order.getStatus()) {
            case ACCEPTED:
                title = "Order Accepted";
                body = shopName + " has accepted your order. They are getting it ready.";
                break;
            case REJECTED:
                title = "Order Rejected";
                body = shopName + " could not accept your order. Reason: "
                        + (order.getRejectionReason() != null
                            ? order.getRejectionReason() : "Not specified");
                break;
            case PREPARING:
                title = "Order Being Prepared";
                body = shopName + " is now packing your order.";
                break;
            case READY_FOR_PICKUP:
                title = "Ready for Pickup!";
                body = "Your order from " + shopName + " is packed and ready. Come pick it up!";
                break;
            case COMPLETED:
                title = "Order Completed";
                body = "Thank you! Your order from " + shopName + " is complete.";
                break;
            default:
                return;
        }

        createNotification(customer, order, title, body);
    }

    // Get unread notifications for a user
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    // Mark all notifications as read
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    // Mark single notification as read
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}