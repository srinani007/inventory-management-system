package com.synexiai.user;

import com.synexiai.user.dto.AuthResponse;
import com.synexiai.user.dto.LoginRequest;
import com.synexiai.user.dto.SignupRequest;
import com.synexiai.user.dto.UserDto;
import com.synexiai.user.model.RoleEntity;
import com.synexiai.user.repository.RoleRepository;
import com.synexiai.user.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@Import(TestSecurityConfig.class)
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private RoleRepository roleRepository;

    private String generateValidUsername() {
        return "user" + (System.currentTimeMillis() % 100000);
    }

    private String generateValidPassword() {
        return "ValidPass123!";
    }

    @BeforeEach
    void setup() {
        // Ensure test roles exist in database
        ensureTestRolesExist();
    }

    private void ensureTestRolesExist() {
        for (String role : AuthService.VALID_ROLES) {
            if (!roleRepository.existsByName(role)) {
                RoleEntity entity = new RoleEntity();
                entity.setName(role);
                roleRepository.save(entity);
            }
        }
    }

    private SignupRequest createSignupRequest(String username, String password, Set<String> roles) {
        return SignupRequest.builder()
                .username(username)
                .password(password)
                .email(username + "@example.com") // ✅ Add a dummy but valid email
                .roles(roles)
                .build();
    }

    private LoginRequest createLoginRequest(String username, String password) {
        return LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
    }

    @Test
    public void testSuccessfulRegistration() {
        SignupRequest request = createSignupRequest(
                generateValidUsername(),
                generateValidPassword(),
                Set.of("ROLE_ADMIN")
        );

        ResponseEntity<UserDto> response = restTemplate.postForEntity(
                "/api/auth/signup",
                request,
                UserDto.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(request.getUsername(), response.getBody().getUsername());
    }

    @Test
    public void testDuplicateUsername() {
        String username = generateValidUsername();
        String password = generateValidPassword();

        // First registration
        registerTestUser(username, password, Set.of("ROLE_USER"));

        // Second attempt
        ResponseEntity<Map> response = restTemplate.exchange(
                "/api/auth/signup",
                HttpMethod.POST,
                new HttpEntity<>(createSignupRequest(username, "DifferentPass123!", Set.of("ROLE_USER"))),
                Map.class);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("already exists"));
    }

    @Test
    public void testInvalidPassword() {
        SignupRequest request = new SignupRequest();
        request.setUsername("user_" + System.currentTimeMillis());
        request.setPassword("short"); // Invalid password
        request.setRoles(Set.of("ROLE_USER")); // ✅ Correct

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/auth/signup",
                request,
                Map.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Password must be 6-40 characters"));
    }

    @Test
    public void testInvalidRoles() {
        SignupRequest request = createSignupRequest(
                generateValidUsername(),
                generateValidPassword(),
                Set.of("INVALID_ROLE")
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/auth/signup",
                request,
                Map.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid roles") ||
                response.getBody().toString().contains("not configured in database"));
    }

    @Test
    public void testRegisterAndLoginFlow() {
        // Registration
        String username = generateValidUsername();
        String password = generateValidPassword();

        UserDto user = registerTestUser(username, password, Set.of("ROLE_USER"));
        assertNotNull(user);

        // Login
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                "/api/auth/login",
                createLoginRequest(username, password),
                AuthResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody().getToken());
    }

    private UserDto registerTestUser(String username, String password, Set<String> roles) {
        SignupRequest request = createSignupRequest(username, password, roles);

        ResponseEntity<UserDto> response = restTemplate.postForEntity(
                "/api/auth/signup",
                request,
                UserDto.class);

        if (response.getStatusCode() == HttpStatus.CREATED) {
            return response.getBody();
        }
        return null;
    }

    @Test
    public void testSuccessfulRegistrationWithUserRole() {
        SignupRequest request = new SignupRequest();
        request.setUsername("user_" + System.currentTimeMillis());
        request.setPassword("ValidPass123!");
        request.setRoles(Collections.singleton("ROLE_USER"));
        request.setEmail("testuser_" + System.currentTimeMillis() + "@example.com");

        ResponseEntity<UserDto> response = restTemplate.postForEntity(
                "/api/auth/signup",
                request,
                UserDto.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(request.getUsername(), response.getBody().getUsername());
    }


}