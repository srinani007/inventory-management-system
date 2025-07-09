package com.SynexiAI.inventor.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final Key key;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) throws JwtException {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims extractClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @SuppressWarnings("unchecked")
    public Set<SimpleGrantedAuthority> getAuthorities(String token) throws JwtException {
        Claims claims = extractClaims(token);
        List<String> roles = claims.get("roles", List.class);
        if (roles == null) return Set.of();
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }

    // ✅ This method wraps validate + extract (used by filter)
    public Claims validateToken(String token) throws JwtException {
        return extractClaims(token); // Optionally log more here
    }
}
