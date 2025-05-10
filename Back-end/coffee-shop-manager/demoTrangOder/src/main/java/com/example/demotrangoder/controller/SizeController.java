package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Size;
import com.example.demotrangoder.service.ISizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin(origins = "*")
public class SizeController {
    @Autowired
    private ISizeService sizeService;
    @GetMapping
    public List<Size> getAllSizes() {
        return sizeService.getAllSizes();
    }

}
