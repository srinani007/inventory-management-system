package com.SynexiAI.inventor.dto;

import lombok.Data;
import lombok.Getter;

import java.time.Instant;

@Data
public class ErrorResponse {
    private final String message;
    private String errorCode = "";
    private final Instant timestamp = Instant.now();

    public ErrorResponse(String message) {
        this.message = message;
        this.errorCode = errorCode;
    }

}
