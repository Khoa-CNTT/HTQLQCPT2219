package com.example.demotrangoder.Validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class SalaryMultipleValidator implements ConstraintValidator<SalaryMultiple, Double> {

    @Override
    public void initialize(SalaryMultiple constraintAnnotation) {
    }

    @Override
    public boolean isValid(Double salary, ConstraintValidatorContext context) {
        if (salary == null) {
            return true; // Bỏ qua nếu là null
        }
        return salary > 0 && salary % 100000 == 0;
    }
}
