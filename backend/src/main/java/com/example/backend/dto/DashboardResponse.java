package com.example.backend.dto;

public class DashboardResponse {
    public String username;
    public String email;
    public String fullname;
    public String message;

    public DashboardResponse(String username, String email, String fullname) {
        this.username = username;
        this.email = email;
        this.fullname = fullname;
        this.message = "Welcome to your dashboard";
    }
}
