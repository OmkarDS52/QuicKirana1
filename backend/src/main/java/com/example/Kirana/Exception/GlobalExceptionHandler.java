package com.example.Kirana.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }
}
//```
//
//---
//
//## Test It
//
//Run the app and hit these two endpoints using Postman or any API client:
//
//**Register:**
//```
//POST http://localhost:8080/api/auth/register
//Content-Type: application/json
//
//{
//  "name": "Rahul Patil",
//  "phone": "9876543210",
//  "password": "test1234",
//  "role": "CUSTOMER"
//}
//```
//
//**Login:**
//```
//POST http://localhost:8080/api/auth/login
//Content-Type: application/json
//
//{
//  "phone": "9876543210",
//  "password": "test1234"
//}
