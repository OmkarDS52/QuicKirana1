package com.example.Kirana.DTOs.Response;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class ShopResponse {
    private String id;
    private String name;
    private String address;
    private String area;
    private String city;
    private String phone;
    private String whatsappNumber;
    private Boolean isOpen;
    private String ownerId;
    private String ownerName;
}