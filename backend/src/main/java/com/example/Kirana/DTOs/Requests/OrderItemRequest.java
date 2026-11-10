package com.example.Kirana.DTOs.Requests;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String productId;      // required
    private String quantity;       // "2", "500"
    private String note;           // optional
}
