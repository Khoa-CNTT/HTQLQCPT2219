package com.example.demotrangoder.Validation;

import com.example.demotrangoder.repo.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String> {

    @Autowired
    private IUserRepository userRepository; // Sử dụng repository để kiểm tra trùng lặp

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        // Loại trừ "admin" và "root"
        if (username.equalsIgnoreCase("admin") || username.equalsIgnoreCase("root")) {
            return false;
        }

        // Kiểm tra username có trùng lặp trong cơ sở dữ liệu
        if (userRepository.existsByUsername(username)) {
            return false;
        }

        return true;
    }
}