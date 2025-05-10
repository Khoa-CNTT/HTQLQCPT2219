package com.example.demotrangoder.service;


import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TokenService {
    private Set<String> tokenBlacklist = new HashSet<>();

    public void invalidateToken(String token) {
        tokenBlacklist.add(token);
    }

    public boolean isTokenInvalidated(String token) {
        return tokenBlacklist.contains(token);
    }
}

