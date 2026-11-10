package com.example.Kirana.DTOs.Response;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ProductResponse {
    private String id;
    private String shopId;
    private String name;
    private String nameMarathi;
    private String category;
    private String unit;
    private BigDecimal pricePerUnit;
    private String stockApprox;
    private Boolean isActive;
    private String imageUrl;
}