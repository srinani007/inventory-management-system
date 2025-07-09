package com.synexiai.user.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {

  private final Key key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
  }

  // ✅ Generate JWT with username + roles
  public String generateToken(String username, Set<String> roles) {
      long expirationMs = 28800000;
      return Jwts.builder()
            .setSubject(username)
            .claim("roles", roles)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
  }

  // ✅ Validate and return Claims
  public Claims validateToken(String token) throws JwtException {
    return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
  }

  // ✅ Extract username from token
  public String extractUsername(String token) throws JwtException {
    return validateToken(token).getSubject();
  }

  // ✅ Extract roles from token
  @SuppressWarnings("unchecked")
  public Set<String> extractRoles(String token) throws JwtException {
    Object roles = validateToken(token).get("roles");
    if (roles instanceof List<?>) {
      return new HashSet<>(((List<?>) roles).stream()
              .map(Object::toString)
              .toList());
    }
    return Set.of();
  }

  // ✅ Check if token is valid & not expired
  public boolean isTokenValid(String token) {
    try {
      Claims claims = validateToken(token);
      return claims.getExpiration().after(new Date());
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }
}
