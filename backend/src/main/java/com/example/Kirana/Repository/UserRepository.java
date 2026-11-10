package com.example.Kirana.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Kirana.Entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByPhone(String phone);
    boolean existsByPhone(String phone);
}