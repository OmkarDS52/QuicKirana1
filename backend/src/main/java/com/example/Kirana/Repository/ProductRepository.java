package com.example.Kirana.Repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.Product;
import com.example.Kirana.Entity.Shop;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByShopIdAndIsActiveTrue(String shopId);

    List<Product> findByShopIdAndCategoryAndIsActiveTrue(String shopId, String category);

}

