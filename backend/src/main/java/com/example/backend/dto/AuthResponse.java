package com.example.backend.dto;

public class AuthResponse {
    public String token;
    public String username;
    public String email;
    public String fullname;
    public String message;

    public AuthResponse(String token, String username) {
        this.token = token;
        this.username = username;
        this.message = "Success";
    }

    public AuthResponse(String token, String username, String email, String fullname) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.fullname = fullname;
        this.message = "Success";
    }
}
