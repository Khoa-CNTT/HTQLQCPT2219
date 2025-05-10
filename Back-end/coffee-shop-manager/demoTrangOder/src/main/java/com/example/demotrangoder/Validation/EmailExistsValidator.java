package com.example.demotrangoder.Validation;

import com.example.demotrangoder.repo.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class EmailExistsValidator implements ConstraintValidator<EmailExists, String> {
    @Autowired
    private IUserRepository userRepository;
    @Override
    public void initialize(EmailExists constraintAnnotation) {
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext constraintValidatorContext) {
        if (userRepository == null) {
            return true;
        }
        return !userRepository.existsByEmail(email);
    }
}
