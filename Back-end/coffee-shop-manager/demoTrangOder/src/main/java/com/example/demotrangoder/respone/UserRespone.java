package com.example.demotrangoder.respone;

import com.example.demotrangoder.dto.UserDTO;
import com.example.demotrangoder.model.Roles;
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