package com.example.Kirana.DTOs.Requests;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String phone;

	@NotBlank
    private String password;
}