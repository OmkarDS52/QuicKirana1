package com.example.Kirana.Service;


import com.example.Kirana.DTOs.Requests.*;
import com.example.Kirana.DTOs.Response.*;
import com.example.Kirana.Entity.User;
import com.example.Kirana.Repository.UserRepository;
import com.example.Kirana.Security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)          // ← add this line
                .preferredLang("mr")     // ← add this too
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getRole().name());
    }
}
