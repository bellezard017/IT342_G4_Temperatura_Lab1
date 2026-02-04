package com.example.backend.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * Encodes a raw password using BCrypt
     * @param rawPassword The plain text password
     * @return Encrypted password hash
     */
    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /**
     * Checks if a raw password matches the encoded hash
     * @param rawPassword The plain text password
     * @param encodedPassword The encrypted password hash
     * @return true if passwords match, false otherwise
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}