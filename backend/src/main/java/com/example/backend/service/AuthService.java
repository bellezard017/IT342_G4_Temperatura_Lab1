package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.PasswordService;
import com.example.backend.security.TokenProvider;
import com.example.backend.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

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
        // Validate input
        if (req.username == null || req.username.trim().isEmpty()) {
            throw new ApiException("Username is required", HttpStatus.BAD_REQUEST);
        }
        if (req.email == null || !isValidEmail(req.email)) {
            throw new ApiException("Invalid email format", HttpStatus.BAD_REQUEST);
        }
        if (req.password == null || !isValidPassword(req.password)) {
            throw new ApiException("Password must be at least 8 characters long and include upper, lower, digit, and special character", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByUsername(req.username)) {
            throw new ApiException("Username already exists", HttpStatus.CONFLICT);
        }
        
        if (userRepository.existsByEmail(req.email)) {
            throw new ApiException("Email already exists", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUsername(req.username.trim());
        user.setEmail(req.email.trim().toLowerCase());
        user.setFullname(req.fullname == null ? "" : req.fullname.trim());
        user.setPassword_hash(passwordService.encode(req.password));

        userRepository.save(user);

        return new AuthResponse(
                tokenProvider.generateToken(user.getUsername()),
                user.getUsername(),
                user.getEmail(),
                user.getFullname()
        );
    }

    public AuthResponse login(LoginRequest req) {
        if (req.username == null || req.username.trim().isEmpty()) {
            throw new ApiException("Username is required", HttpStatus.BAD_REQUEST);
        }
        if (req.password == null || req.password.trim().isEmpty()) {
            throw new ApiException("Password is required", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByUsername(req.username)
                .orElseThrow(() -> new ApiException("Invalid username or password", HttpStatus.UNAUTHORIZED));

        if (!passwordService.matches(req.password, user.getPassword_hash())) {
            throw new ApiException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }

        return new AuthResponse(
                tokenProvider.generateToken(user.getUsername()),
                user.getUsername(),
                user.getEmail(),
                user.getFullname()
        );
    }

    public DashboardResponse dashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        return new DashboardResponse(
                user.getUsername(),
                user.getEmail(),
                user.getFullname()
        );
    }

    // Simple email validation
    private boolean isValidEmail(String email) {
        if (email == null) return false;
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.compile(regex).matcher(email).matches();
    }

    // Password must contain at least 8 chars, one upper, one lower, one digit, one special
    private boolean isValidPassword(String password) {
        if (password == null) return false;
        if (password.length() < 8) return false;
        boolean hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }

    public void logout(String token) {
        tokenProvider.invalidateToken(token);
    }
}