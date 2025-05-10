package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Size;
import com.example.demotrangoder.repo.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SizeService implements ISizeService {
    @Autowired
    private SizeRepository sizeRepository;
    @Override
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();
    }
}
