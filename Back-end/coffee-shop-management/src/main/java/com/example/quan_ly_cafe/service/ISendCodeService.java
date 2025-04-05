package com.example.quan_ly_cafe.service;


import com.example.quan_ly_cafe.dto.SendCodeDTO;
import com.example.quan_ly_cafe.model.SendCode;

public interface ISendCodeService {
    void save(SendCodeDTO session);
    SendCode findByEmail(String email);
    void delete(SendCode sendCode);
}
