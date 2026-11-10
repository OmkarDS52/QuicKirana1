package com.example.Kirana.DTOs.Requests;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private String status;
    private String rejectionReason;   // only needed if status is REJECTED
}