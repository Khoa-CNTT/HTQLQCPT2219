package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ICategoryService {
    Page<Category> findAll(Pageable pageable);
    Category save(Category category); // Phương thức lưu Category

    Optional<Category> findById(Long categoryId);  // Thêm phương thức này
    void deleteById(Long categoryId);

}
