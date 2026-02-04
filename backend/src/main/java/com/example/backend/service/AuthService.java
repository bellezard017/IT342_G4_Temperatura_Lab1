package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.TokenProvider;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final TokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordService passwordService,
                       TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest req) {

        if (userRepository.existsByUsername(req.username) ||
                userRepository.existsByEmail(req.email)) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setFullname(req.fullname);
        user.setPassword_hash(passwordService.encode(req.password));

        userRepository.save(user);

        return new AuthResponse(
                tokenProvider.generateToken(user.getUsername()),
                user.getUsername()
        );
    }

    public AuthResponse login(LoginRequest req) {

        User user = userRepository.findByUsername(req.username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordService.matches(req.password, user.getPassword_hash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new AuthResponse(
                tokenProvider.generateToken(user.getUsername()),
                user.getUsername()
        );
    }

    public DashboardResponse dashboard(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new DashboardResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullname()
        );
    }

    public void logout(String token) {
        tokenProvider.invalidateToken(token);
    }
}
