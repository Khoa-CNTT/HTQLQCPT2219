package com.example.demotrangoder.Validation;

import com.example.demotrangoder.repo.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UsernameExistsValidator implements ConstraintValidator<UsernameExists, String> {
    @Autowired
    private IUserRepository userRepository;
    @Override
    public void initialize(UsernameExists constraintAnnotation) {
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (userRepository == null) {
            return false;
        }
        return !userRepository.existsByUsername(s);
    }
}