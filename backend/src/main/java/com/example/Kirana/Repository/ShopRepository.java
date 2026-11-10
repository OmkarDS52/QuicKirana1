package com.example.Kirana.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.Shop;

public interface ShopRepository extends JpaRepository<Shop, String> {
    List<Shop> findByAreaAndIsActiveTrue(String area);
    List<Shop> findByOwnerIdAndIsActiveTrue(String ownerId);
}
