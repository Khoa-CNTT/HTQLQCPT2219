package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Roles;
import com.example.quan_ly_cafe.repo.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService implements IRoleService {
    @Autowired
    private RoleRepository roleRepository;
    @Override
    public List<Roles> findAll() {
        return roleRepository.findAll();
    }
}
