package com.hms.user.util;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.hms.user.exception.HmsException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Strong secret key (256-bit minimum recommended)
    private final String SECRET_KEY = "mysecretkey123456mysecretkey123456"; 

    // Generate JWT token with username as subject
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate the token
    public void validateToken(String token) throws HmsException {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseClaimsJws(token);
        } catch (JwtException e) {
            throw new HmsException("Invalid JWT token");
        }
    }

    // Extract username from token
    public String extractUsername(String token) throws HmsException {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException e) {
            throw new HmsException("Cannot extract username from JWT token");
        }
    }

    // Optional: check if token is expired
    public boolean isTokenExpired(String token) throws HmsException {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            throw new HmsException("Cannot check expiration for JWT token");
        }
    }
}

