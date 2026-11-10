package com.example.Kirana.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.Order;
import com.example.Kirana.Enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<Order> findByShopIdOrderByCreatedAtDesc(String shopId);
    List<Order> findByShopIdAndStatus(String shopId, OrderStatus status);
}