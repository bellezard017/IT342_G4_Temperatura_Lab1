package com.example.backend.controller;

import com.example.backend.dto.CreateUserRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.exception.ApiException;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public UserController(UserRepository userRepository, PasswordService passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest req) {
        validateCreateRequest(req);

        if (userRepository.existsByUsername(req.username.trim())) {
            throw new ApiException("Username already in use", HttpStatus.CONFLICT);
        }
        if (userRepository.existsByEmail(req.email.trim().toLowerCase())) {
            throw new ApiException("Email already in use", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setUsername(req.username.trim());
        user.setEmail(req.email.trim().toLowerCase());
        user.setFullname(req.fullname == null ? "" : req.fullname.trim());
        user.setPassword_hash(passwordService.encode(req.password));

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(toResponse(user));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (req.username != null && !req.username.trim().isEmpty()) {
            userRepository.findByUsername(req.username.trim())
                    .filter(existing -> !existing.getUser_id().equals(id))
                    .ifPresent(existing -> {
                        throw new ApiException("Username already in use", HttpStatus.CONFLICT);
                    });
            user.setUsername(req.username.trim());
        }

        if (req.email != null && !req.email.trim().isEmpty()) {
            userRepository.findByEmail(req.email.trim().toLowerCase())
                    .filter(existing -> !existing.getUser_id().equals(id))
                    .ifPresent(existing -> {
                        throw new ApiException("Email already in use", HttpStatus.CONFLICT);
                    });
            user.setEmail(req.email.trim().toLowerCase());
        }

        if (req.fullname != null) {
            user.setFullname(req.fullname.trim());
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(toResponse(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ApiException("User not found", HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUser_id(),
                user.getUsername(),
                user.getEmail(),
                user.getFullname()
        );
    }

    private void validateCreateRequest(CreateUserRequest req) {
        if (req == null) {
            throw new ApiException("Request body is required", HttpStatus.BAD_REQUEST);
        }
        if (req.username == null || req.username.trim().isEmpty()) {
            throw new ApiException("Username is required", HttpStatus.BAD_REQUEST);
        }
        if (req.email == null || !isValidEmail(req.email)) {
            throw new ApiException("Invalid email format", HttpStatus.BAD_REQUEST);
        }
        if (req.password == null || !isValidPassword(req.password)) {
            throw new ApiException(
                    "Password must be at least 8 characters long and include upper, lower, digit, and special character",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null) return false;
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.compile(regex).matcher(email).matches();
    }

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
}
