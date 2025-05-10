package com.example.demotrangoder.respone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

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
