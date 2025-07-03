package com.SynexiAI.inventor.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Set;


@Component
public class JwtUtil {

  private final Key key;
  private final long expirationMs = 3600000; // 1 hour

  public JwtUtil() {
    this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  }

  public String generateToken(String username, Set<String> roles) {
    return Jwts.builder()
            .setSubject(username)
            .claim("roles", roles)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(key)
            .compact();
  }

  public Claims validateToken(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
  }
}