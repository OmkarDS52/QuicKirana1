package com.example.Kirana.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    List<OrderItem> findByOrderId(String orderId);
}
