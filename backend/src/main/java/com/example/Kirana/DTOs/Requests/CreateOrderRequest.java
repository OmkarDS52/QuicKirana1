package com.example.Kirana.DTOs.Requests;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private String shopId;
    private String customerNote;
    private String paymentMode;    // CASH, UPI, CREDIT
    private List<OrderItemRequest> items;
}