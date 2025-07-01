package com.SynexiAI.inventor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;
import lombok.Value;
import java.util.Set;

@Value
@Builder
@Data
public class SignupResponse {
    @NotBlank String username;
    @NotEmpty Set<@NotBlank String> roles;
    @NotBlank String message;
}