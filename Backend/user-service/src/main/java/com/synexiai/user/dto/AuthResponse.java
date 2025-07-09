package com.synexiai.user.dto;

import lombok.Builder;

import java.util.Set;

public class AuthResponse {
    private final String token;
    private final String username;
    private final Set<String> roles;
    private String tokenType = "Bearer";

    @Builder
    public AuthResponse(String token, String username, Set<String> roles, String tokenType
                        ) {
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.tokenType = tokenType;
    }

    // Getters...

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                ", username='" + username + '\'' +
                ", roles=" + roles +
                ", tokenType='" + tokenType + '\'' +
                '}';
    }
}