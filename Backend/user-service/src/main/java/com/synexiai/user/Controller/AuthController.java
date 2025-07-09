package com.synexiai.user.controller;

import com.synexiai.user.dto.AuthResponse;
import com.synexiai.user.dto.LoginRequest;
import com.synexiai.user.dto.SignupRequest;
import com.synexiai.user.dto.UserDto;
import com.synexiai.user.exception.InvalidRoleException;
import com.synexiai.user.exception.UserAlreadyExistsException;
import com.synexiai.user.model.User;
import com.synexiai.user.repository.UserRepository;
import com.synexiai.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Validated
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication API endpoints")
@Slf4j
public class AuthController {

  private final AuthService authService;
  private final UserRepository userRepository;

  // 🚀 Signup endpoint
  @Operation(summary = "Register a new user")
  @ApiResponses({
          @ApiResponse(responseCode = "201", description = "User created successfully"),
          @ApiResponse(responseCode = "400", description = "Invalid input"),
          @ApiResponse(responseCode = "409", description = "Username already exists")
  })
  @PostMapping("/signup")
  public ResponseEntity<UserDto> signup(@RequestBody @Valid SignupRequest request) {
    log.info("🔐 Signup attempt for username: {}", request.getUsername());
    UserDto userDto = authService.registerUser(request);
    log.info("✅ User registered: {}", userDto.getUsername());
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  // 🚀 Login endpoint
  @Operation(summary = "Authenticate user and return JWT")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Authenticated successfully"),
          @ApiResponse(responseCode = "401", description = "Invalid credentials")
  })
  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
    log.info("🔑 Login attempt: {}", request.getUsername());
    AuthResponse response = authService.authenticateUser(request);
    log.info("✅ Authenticated: {}", request.getUsername());
    return ResponseEntity.ok(response);
  }

  // 🔒 Admin-only user listing
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @GetMapping("/users")
  public List<UserDto> listAllUsers() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    log.info("👀 Listing users - accessed by: {}", auth.getName());
    return authService.getAllUsers();
  }

  // ✅ NEW: Get email by username for other services
  @Operation(summary = "Get user email by username")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Email found"),
          @ApiResponse(responseCode = "404", description = "User not found")
  })
  @GetMapping("/email/{username}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<String> getEmailByUsername(@PathVariable String username) {
    log.info("📩 Fetching email for: {}", username);
    Optional<User> user = userRepository.findByUsername(username);
    return user.map(value -> ResponseEntity.ok(value.getEmail()))
            .orElse(ResponseEntity.notFound().build());
  }

  // 🔥 Global exception handlers
  @ExceptionHandler(UserAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
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
