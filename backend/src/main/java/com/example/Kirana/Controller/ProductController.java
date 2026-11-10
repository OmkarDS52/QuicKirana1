package com.example.Kirana.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Kirana.DTOs.Requests.ProductRequest;
import com.example.Kirana.DTOs.Response.ProductResponse;
import com.example.Kirana.Service.ProductService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Shop owner adds product
    @PostMapping
    public ResponseEntity<ProductResponse> addProduct(
            Authentication auth,
            @RequestBody ProductRequest request) {
        String ownerId = auth.getPrincipal().toString();
        return ResponseEntity.ok(productService.addProduct(ownerId, request));
    }

    // Shop owner updates product
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String productId,
            @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    // Shop owner toggles product visibility
    @PatchMapping("/{productId}/toggle")
    public ResponseEntity<ProductResponse> toggleProduct(@PathVariable String productId) {
        return ResponseEntity.ok(productService.toggleProduct(productId));
    }

    // Shop owner updates stock status
    @PatchMapping("/{productId}/stock/{status}")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable String productId,
            @PathVariable String status) {
        return ResponseEntity.ok(productService.updateStock(productId, status));
    }

    @PostMapping("/images")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("image") MultipartFile image)
            throws IOException {
        if (image.isEmpty()) {
            throw new RuntimeException("Image file is required");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image uploads are allowed");
        }

        String originalName = image.getOriginalFilename() == null ? "" : image.getOriginalFilename();
        String extension = "";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < originalName.length() - 1) {
            extension = originalName.substring(dotIndex).replaceAll("[^A-Za-z0-9.]", "");
        }

        Path uploadDir = Path.of("uploads", "product-images");
        Files.createDirectories(uploadDir);

        String fileName = UUID.randomUUID() + extension;
        Path destination = uploadDir.resolve(fileName);
        image.transferTo(destination.toFile());

        String imageUrl = "/uploads/product-images/" + fileName;
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    // Customer browses shop products
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<ProductResponse>> getByShop(@PathVariable String shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    // Customer filters by category
    @GetMapping("/shop/{shopId}/category/{category}")
    public ResponseEntity<List<ProductResponse>> getByCategory(
            @PathVariable String shopId,
            @PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(shopId, category));
    }
}
