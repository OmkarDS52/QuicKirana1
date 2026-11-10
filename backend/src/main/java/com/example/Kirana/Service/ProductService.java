package com.example.Kirana.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.Kirana.DTOs.Requests.ProductRequest;
import com.example.Kirana.DTOs.Response.ProductResponse;
import com.example.Kirana.Entity.Product;
import com.example.Kirana.Entity.Shop;
import com.example.Kirana.Enums.StockStatus;
import com.example.Kirana.Repository.ProductRepository;
import com.example.Kirana.Repository.ShopRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;

    // Shop owner adds a product
    public ProductResponse addProduct(String ownerId, ProductRequest request) {

        Shop shop = shopRepository.findByOwnerIdAndIsActiveTrue(ownerId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Shop not found for this owner"));

        Product product = Product.builder()
                .shop(shop)
                .name(request.getName())
                .nameMarathi(request.getNameMarathi())
                .category(request.getCategory())
                .unit(request.getUnit())
                .pricePerUnit(BigDecimal.valueOf(request.getPricePerUnit()))
                .stockApprox(StockStatus.valueOf(
                    request.getStockApprox() != null ? request.getStockApprox() : "IN_STOCK"))
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        productRepository.save(product);
        return mapToResponse(product);
    }

    // Shop owner updates a product
    public ProductResponse updateProduct(String productId, ProductRequest request) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setNameMarathi(request.getNameMarathi());
        product.setCategory(request.getCategory());
        product.setUnit(request.getUnit());
        product.setPricePerUnit(BigDecimal.valueOf(request.getPricePerUnit()));
        product.setStockApprox(StockStatus.valueOf(request.getStockApprox()));
        product.setImageUrl(request.getImageUrl());

        productRepository.save(product);
        return mapToResponse(product);
    }

    // Shop owner toggles product active/inactive
    public ProductResponse toggleProduct(String productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsActive(!product.getIsActive());
        productRepository.save(product);
        return mapToResponse(product);
    }

    // Shop owner updates stock status
    public ProductResponse updateStock(String productId, String stockStatus) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStockApprox(StockStatus.valueOf(stockStatus));
        productRepository.save(product);
        return mapToResponse(product);
    }

    // Customer browses all products of a shop
    public List<ProductResponse> getProductsByShop(String shopId) {
        return productRepository.findByShopIdAndIsActiveTrue(shopId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Customer browses products by category
    public List<ProductResponse> getProductsByCategory(String shopId, String category) {
        return productRepository.findByShopIdAndCategoryAndIsActiveTrue(shopId, category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .shopId(product.getShop().getId())
                .name(product.getName())
                .nameMarathi(product.getNameMarathi())
                .category(product.getCategory())
                .unit(product.getUnit())
                .pricePerUnit(product.getPricePerUnit())
                .stockApprox(product.getStockApprox().name())
                .isActive(product.getIsActive())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
