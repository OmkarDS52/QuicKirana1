package com.example.Kirana.DTOs.Requests;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String nameMarathi;
    private String category;
    private String unit;
    private Double pricePerUnit;
    private String stockApprox;    // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    private String imageUrl;
}