package com.example.backend.dto;

public class UserResponse {
    public Long id;
    public String username;
    public String email;
    public String fullname;

    public UserResponse(Long id, String username, String email, String fullname) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullname = fullname;
    }
}
