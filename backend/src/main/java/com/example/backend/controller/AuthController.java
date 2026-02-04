package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/dashboard/{username}")
    public ResponseEntity<DashboardResponse> dashboard(@PathVariable String username) {
        return ResponseEntity.ok(authService.dashboard(username));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<DashboardResponse> profile(@PathVariable String username) {
        return ResponseEntity.ok(authService.dashboard(username));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok("Logged out");
    }
}
