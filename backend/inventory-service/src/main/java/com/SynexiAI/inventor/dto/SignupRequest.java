package com.SynexiAI.inventor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 40, message = "Username must be between 3-40 characters")
    private String username;

    @NotBlank
    @Size(min = 3, max = 40)
    private String password;

    private Set<@Pattern(regexp = "ROLE_[A-Z]+") String> roles;
    // getters and setters
}