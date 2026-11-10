package com.example.Kirana.DTOs.Response;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class OrderResponse {
    private String id;
    private String shopId;
    private String shopName;
    private String customerId;
    private String customerName;
    private String status;
    private String paymentMode;
    private BigDecimal totalAmount;
    private String customerNote;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
