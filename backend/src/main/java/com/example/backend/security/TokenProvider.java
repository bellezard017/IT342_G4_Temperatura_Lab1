package com.example.backend.security;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class TokenProvider {

    public String generateToken(String username) {
        return UUID.randomUUID().toString();
    }

    public void invalidateToken(String token) {
        // placeholder (JWT can be added later)
    }
}
