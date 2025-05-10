package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Roles;
import com.example.demotrangoder.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {
    @Autowired
    private RoleService roleService;
    @GetMapping("")
    @CrossOrigin(origins = "http://localhost:3000")  // Chỉ cho phép frontend từ cổng 3000
    public ResponseEntity<?>findAllRoles() {
        List<Roles> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }
}
