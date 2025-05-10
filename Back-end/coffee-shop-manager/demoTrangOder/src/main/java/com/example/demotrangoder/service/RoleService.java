package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Roles;
import com.example.demotrangoder.repo.RoleRepository;
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
