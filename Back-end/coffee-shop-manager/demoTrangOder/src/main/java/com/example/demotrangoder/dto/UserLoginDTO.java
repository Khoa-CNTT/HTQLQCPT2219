package com.example.demotrangoder.dto;

import com.example.demotrangoder.Validation.UsernameExists;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO implements Validator {
    @NotBlank(message = "Khong duoc de trong")
    @Size(min = 3, max = 50, message = "Ten nguoi dung phai co do dai tu 3 den 20 ky tu")
//    @UsernameExists
    private String username;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 8, message = "Mat khau phai co it nhat 8 ky tu")
    private String password;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {

    }
}