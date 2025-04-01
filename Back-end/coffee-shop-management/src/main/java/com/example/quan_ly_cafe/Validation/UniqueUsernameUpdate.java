package com.example.quan_ly_cafe.Validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueUsernameUpdateValidator.class)
public @interface UniqueUsernameUpdate {
    String message() default "Tên đăng nhập đã tồn tại.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

