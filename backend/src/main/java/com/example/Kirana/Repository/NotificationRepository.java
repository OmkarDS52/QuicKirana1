package com.example.Kirana.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserIdAndIsReadFalse(String userId);
}