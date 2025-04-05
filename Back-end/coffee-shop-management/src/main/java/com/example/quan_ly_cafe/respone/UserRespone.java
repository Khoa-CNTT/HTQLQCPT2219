package com.example.quan_ly_cafe.respone;

import com.example.quan_ly_cafe.dto.UserDTO;
import com.example.quan_ly_cafe.model.Roles;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRespone {
    private UserDTO userDTO;
    private Roles role;
    private String token;
    private String message;
}