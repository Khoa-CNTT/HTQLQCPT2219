package com.example.demotrangoder.dto;


import com.example.demotrangoder.Validation.EmailExists;
import com.example.demotrangoder.Validation.NumberphoneExists;
import com.example.demotrangoder.Validation.UsernameExists;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.sql.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO implements Validator {


    private  String imgUrl;

    @NotBlank(message = "Khonng duoc de trong ten")
    @Size(max = 50,message = "khong duoc qua 50 ki tu")
    private String fullName;

    private String address;

    @DateTimeFormat(pattern = "yyyy/MM/dd")
    private Date birthday;

    @NotBlank(message = "so dien thoai khong duoc de trong ")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "So dien thoai khong dung dinh dang ")
    @NumberphoneExists
    private String numberphone;

    @NotBlank(message = "Khong duoc de trong")
    @Size(min = 6, message = "Tên đăng nhập phải lớn hơn 6 ký tự")
    @UsernameExists
    private String username;

    @NotBlank(message = "Khong duoc de trong password")
    @Size(min = 8, message = "Mat khau phai co it nhat 8 ky tu")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{4,}$",
            message = "Mật khẩu phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 ký tự số, và 1 ký tự đặc biệt")
    private String password;

    @NotBlank(message = "Khong duoc de trong email")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Email không hợp lệ")
    @Size(max = 50,message = "khong duoc qua 50 ki tu")
    @EmailExists
    private String email;

    private Double salary;


    private Boolean isActive;
    private  Boolean gender;

    private Integer roleId;


    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {
    }

}
