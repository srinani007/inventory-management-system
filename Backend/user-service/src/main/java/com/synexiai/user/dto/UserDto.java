package com.synexiai.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import java.util.Set;

@Value
@Builder
public class UserDto {
    String username;
    Set<String> roles;
    String email;


    public UserDto(String username, Set<String> roles, String email) {
        this.username = username;
        this.roles = roles;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public String getEmail() {
        return email;
    }
}