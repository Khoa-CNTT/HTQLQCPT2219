package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Category;
import com.example.demotrangoder.repo.CategoryRepository;
import com.example.demotrangoder.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "*")

public class CategoryController {
    @Autowired
    private ICategoryService categoryService;
@Autowired
private CategoryRepository categoryRepository;
    @GetMapping("")
    public ResponseEntity<Page<Category>> findAllCategory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryService.findAll(pageable);
        return ResponseEntity.ok(categories);
    }
    // Phương thức POST để thêm một category mới
    @PostMapping("")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        // Lưu category vào cơ sở dữ liệu
        Category savedCategory = categoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory); // Trả về status 201 khi tạo thành công
    }
    // Phương thức PUT để cập nhật category
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long categoryId, @RequestBody Category category) {
        // Kiểm tra nếu category có tồn tại trong DB
        Optional<Category> existingCategory = categoryService.findById(categoryId);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về status 404 nếu không tìm thấy
        }

        // Cập nhật thông tin category
        category.setCategoryId(categoryId); // Đảm bảo id của category không thay đổi
        Category updatedCategory = categoryService.save(category);

        return ResponseEntity.ok(updatedCategory); // Trả về category đã cập nhật
    }
    @GetMapping("/findById/{categoryId}")
    public ResponseEntity<Category> findById(@PathVariable Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);

        // Kiểm tra nếu danh mục không tồn tại
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());  // Trả về danh mục nếu tìm thấy
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Trả về lỗi 404 nếu không tìm thấy
        }
    }
    // Phương thức DELETE để xóa category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        try {
            categoryService.deleteById(categoryId);  // Gọi service để xóa
            return ResponseEntity.noContent().build();  // Trả về status 204
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Trả về lỗi 404 nếu không tìm thấy
        }
    }
}
