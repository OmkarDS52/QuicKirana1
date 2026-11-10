package com.example.Kirana.DTOs.Requests;

import lombok.Data;

@Data
public class ShopRequest {
    private String name;
    private String address;
    private String area;
    private String city;
    private String phone;
    private String whatsappNumber;
}