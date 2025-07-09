package com.synexiai.user;

import com.synexiai.user.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    @InjectMocks
    private JwtUtil jwtUtil = new JwtUtil("ThisIsMySuperSecretKeyForJWTDoNotShare");

    @Test
    void testValidateToken() {
        String token = jwtUtil.generateToken("adminUser", Set.of("ROLE_ADMIN"));

        Claims claims = jwtUtil.validateToken(token);

        assertEquals("adminUser", claims.getSubject());
        assertTrue(((List<?>) claims.get("roles")).contains("ROLE_ADMIN"));
    }
}
