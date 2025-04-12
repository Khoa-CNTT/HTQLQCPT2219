package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ICategoryService {
    Page<Category> findAll(Pageable pageable);
    Category save(Category category); // Phương thức lưu Category

    Optional<Category> findById(Long categoryId);  // Thêm phương thức này
    void deleteById(Long categoryId);

}
