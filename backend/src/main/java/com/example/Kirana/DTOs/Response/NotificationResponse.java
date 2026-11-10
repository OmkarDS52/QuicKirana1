package com.example.Kirana.DTOs.Response;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class NotificationResponse {
    private String id;
    private String title;
    private String body;
    private Boolean isRead;
    private String orderId;
    private LocalDateTime createdAt;
}
