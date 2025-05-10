package com.example.demotrangoder.Validation;


import com.example.demotrangoder.repo.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class NumberphoneExistsValidator implements ConstraintValidator<NumberphoneExists, String> {
    @Autowired
    private IUserRepository userRepository;
    @Override
    public void initialize(NumberphoneExists constraintAnnotation) {
    }

    @Override
    public boolean isValid(String numberphone, ConstraintValidatorContext constraintValidatorContext) {
        if (userRepository == null) {
            return true;
        }
        return  !userRepository.existsByNumberphone(numberphone);
    }
}
