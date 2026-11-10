package com.example.Kirana.DTOs.Response;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class OrderItemResponse {
    private String id;
    private String itemName;
    private String quantity;
    private String note;
    private Boolean isAvailable;
}