package com.SynexiAI.inventor.controller;

import com.SynexiAI.inventor.dto.AuthResponse;
import com.SynexiAI.inventor.dto.LoginRequest;
import com.SynexiAI.inventor.dto.SignupRequest;
import com.SynexiAI.inventor.dto.UserDto;
import com.SynexiAI.inventor.exception.InvalidRoleException;
import com.SynexiAI.inventor.exception.UserAlreadyExistsException;
import com.SynexiAI.inventor.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication API endpoints")
@Slf4j  // Lombok annotation for logging
public class AuthController {

  private final AuthService authService;

  @Operation(
          summary = "Register a new user",
          description = "Creates a new user account with the provided credentials"
  )
  @ApiResponses({
          @ApiResponse(responseCode = "201", description = "User created successfully"),
          @ApiResponse(responseCode = "400", description = "Invalid input data"),
          @ApiResponse(responseCode = "409", description = "Username already exists")
  })
  @PostMapping("/signup")
  public ResponseEntity<UserDto> signup(@RequestBody @Valid SignupRequest request) {
    log.info("Registration attempt for username: {}", request.getUsername());
    UserDto userDto = authService.registerUser(request);
    log.info("User registered successfully: {}", request.getUsername());
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  @Operation(
          summary = "Authenticate user",
          description = "Authenticates user and returns JWT token"
  )
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Authentication successful"),
          @ApiResponse(responseCode = "401", description = "Invalid credentials"),
          @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
    log.info("Login attempt for user: {}", request.getUsername());
    AuthResponse response = authService.authenticateUser(request);
    log.info("User authenticated successfully: {}", request.getUsername());
    return ResponseEntity.ok(response);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)  // Changed from BAD_REQUEST to CONFLICT
  public Map<String, String> handleUserExists(UserAlreadyExistsException ex) {
    return Map.of("error", ex.getMessage());
  }

  @ExceptionHandler(InvalidRoleException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleInvalidRole(InvalidRoleException ex) {
    return Map.of(
            "error", ex.getMessage(),
            "validRoles", String.join(", ", AuthService.VALID_ROLES)
    );
  }

  @ExceptionHandler(BadCredentialsException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public Map<String, String> handleBadCredentials(BadCredentialsException ex) {
    return Map.of("error", "Invalid username or password");
  }

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleIllegalArgument(IllegalArgumentException ex) {
    return Map.of("error", ex.getMessage());
  }
}