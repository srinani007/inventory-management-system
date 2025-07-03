package com.SynexiAI.inventor.service;

import com.SynexiAI.inventor.dto.AuthResponse;
import com.SynexiAI.inventor.dto.LoginRequest;
import com.SynexiAI.inventor.dto.SignupRequest;
import com.SynexiAI.inventor.dto.UserDto;
import com.SynexiAI.inventor.exception.InvalidRoleException;
import com.SynexiAI.inventor.exception.UserAlreadyExistsException;
import com.SynexiAI.inventor.model.Role;
import com.SynexiAI.inventor.model.User;
import com.SynexiAI.inventor.repository.RoleRepository;
import com.SynexiAI.inventor.repository.UserRepository;
import com.SynexiAI.inventor.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    public static final Set<String> VALID_ROLES = Set.of(
            "ROLE_ADMIN",
            "ROLE_MANAGER",
            "ROLE_WAREHOUSE_STAFF",
            "ROLE_USER"
    );

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserDto registerUser(SignupRequest request) {

        if (request.getPassword().length() < 3 || request.getPassword().length() > 40) {
            throw new IllegalArgumentException("Password must be 3-40 characters");
        }
        // Validate roles against both application and database
        Set<String> roles = validateRoles(request.getRoles());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());

            return buildAuthResponse(user, token);
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }


    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .username(user.getUsername())
                .roles(user.getRoles())
                .build();
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(user.getRoles())
                .tokenType("Bearer")
                .build();
    }

    private Set<String> validateRoles(Set<String> roles) {
        if (roles == null || roles.isEmpty()) {
            return Set.of("ROLE_USER"); // Default role
        }

        // Check against application-level valid roles
        Set<String> invalidRoles = roles.stream()
                .filter(role -> !VALID_ROLES.contains(role))
                .collect(Collectors.toSet());

        if (!invalidRoles.isEmpty()) {
            throw new InvalidRoleException(
                    "Invalid roles: " + invalidRoles +
                            ". Valid roles are: " + VALID_ROLES
            );
        }

        // Additional check against database valid roles
        Set<String> missingDbRoles = roles.stream()
                .filter(role -> !roleRepository.existsByName(role))
                .collect(Collectors.toSet());

        if (!missingDbRoles.isEmpty()) {
            throw new InvalidRoleException(
                    "Roles not configured in database: " + missingDbRoles +
                            ". Please contact administrator."
            );
        }

        return roles;
    }
}