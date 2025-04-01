package com.example.quan_ly_cafe.Validation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SalaryMultipleValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface SalaryMultiple {
    String message() default "Lương phải là bội số của 100.000 VND và lớn hơn 0";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
