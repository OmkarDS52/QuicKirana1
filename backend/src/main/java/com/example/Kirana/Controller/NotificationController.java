package com.example.Kirana.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.Kirana.DTOs.Response.NotificationResponse;
import com.example.Kirana.Entity.Notification;
import com.example.Kirana.Service.NotificationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(Authentication auth) {
        String userId = auth.getPrincipal().toString();
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(mapToResponse(notifications));
    }

    // Mark all as read
    @PatchMapping("/read-all")
    public ResponseEntity<String> markAllRead(Authentication auth) {
        String userId = auth.getPrincipal().toString();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    // Mark single as read
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<String> markRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("Notification marked as read");
    }

    private List<NotificationResponse> mapToResponse(List<Notification> notifications) {
        return notifications.stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .body(n.getBody())
                        .isRead(n.getIsRead())
                        .orderId(n.getOrder() != null ? n.getOrder().getId() : null)
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}