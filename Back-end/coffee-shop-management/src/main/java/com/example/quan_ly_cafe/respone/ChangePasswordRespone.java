package com.example.quan_ly_cafe.respone;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRespone {
    private String message;
    private String username;
    private String oldPassword;
}
