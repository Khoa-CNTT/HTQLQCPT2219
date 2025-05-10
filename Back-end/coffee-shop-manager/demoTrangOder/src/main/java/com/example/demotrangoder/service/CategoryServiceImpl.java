package com.example.demotrangoder.service;

import com.example.demotrangoder.repo.CategoryRepository;

import com.example.demotrangoder.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryServiceImpl implements ICategoryService{
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }
    @Override
    public Category save(Category category) {
        return categoryRepository.save(category); // Lưu category vào cơ sở dữ liệu
    }
    @Override
    public Optional<Category> findById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }
    @Override
    public void deleteById(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            categoryRepository.deleteById(categoryId); // Xóa nếu tồn tại
        } else {
            throw new RuntimeException("Category not found with id: " + categoryId); // Ném lỗi nếu không tìm thấy
        }
    }
}
