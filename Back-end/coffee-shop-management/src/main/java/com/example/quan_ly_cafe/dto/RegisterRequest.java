package com.example.quan_ly_cafe.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {
    private String userName;
    private String password;
    private String fullName;
    private String email;
    private String imgUrl;
    private String numberPhone;
    private LocalDate birthday;
    private Boolean gender;
    private String address;
    private Long roleId; // Thay vì danh sách
}
