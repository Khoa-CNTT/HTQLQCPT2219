package com.example.quan_ly_cafe.respone;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FindUserByEmail {
    private String username;
    private String fullName;
    private String email;
}