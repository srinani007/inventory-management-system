package com.SynexiAI.inventor.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import java.util.Set;

@Value
@Builder
public class UserDto {
    String username;
    Set<String> roles;


    public UserDto(String username, Set<String> roles) {
        this.username = username;
        this.roles = roles;
    }

    public String getUsername() {
        return username;
    }

    public Set<String> getRoles() {
        return roles;
    }
}