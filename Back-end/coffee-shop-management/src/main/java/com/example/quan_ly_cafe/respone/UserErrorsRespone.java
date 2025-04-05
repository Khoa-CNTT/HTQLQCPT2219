package com.example.quan_ly_cafe.respone;

import lombok.*;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserErrorsRespone {
    private String fullName;

    private String address;

    private Date birthday;

    private String numberphone;

    private String username;

    private String password;

    private String email;
    private String gender;
    private String imgUrl;
}
