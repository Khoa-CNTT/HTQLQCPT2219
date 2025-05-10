package com.example.demotrangoder.service;


import com.example.demotrangoder.dto.SendCodeDTO;
import com.example.demotrangoder.model.SendCode;

public interface ISendCodeService {
    void save(SendCodeDTO session);
    SendCode findByEmail(String email);
    void delete(SendCode sendCode);
}
