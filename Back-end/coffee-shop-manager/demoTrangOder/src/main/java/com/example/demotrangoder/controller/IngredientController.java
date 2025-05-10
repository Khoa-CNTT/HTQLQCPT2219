package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.repo.IngredientRepository;
import com.example.demotrangoder.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin("*") // nếu cần cho frontend
public class IngredientController {
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private IngredientService ingredientService;
    @PostMapping
    public ResponseEntity<?> createIngredient(@RequestBody Ingredient ingredient) {
        // Kiểm tra nếu tên nguyên liệu đã tồn tại
        if (ingredientService.existsByName(ingredient.getName())) {
            return ResponseEntity.badRequest().body("Tên nguyên liệu đã tồn tại trong hệ thống.");
        }

        Ingredient newIngredient = ingredientService.addIngredient(ingredient);
        return ResponseEntity.ok(newIngredient);
    }

    // Lấy tất cả nguyên liệu có phân trang
    @GetMapping
    public Page<Ingredient> getAllIngredients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ingredientService.getAllIngredients(pageable);
    }

    // Tìm kiếm nguyên liệu theo tên có phân trang
    @GetMapping("/search")
    public Page<Ingredient> searchIngredients(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ingredientService.searchIngredients(keyword, pageable);
    }


    @GetMapping("/low-stock")
    public ResponseEntity<List<Ingredient>> getLowStockIngredients() {
        List<Ingredient> lowStockItems = ingredientRepository.findLowStockIngredients();
        return ResponseEntity.ok(lowStockItems);
    }
    // Chỉnh sửa nguyên liệu theo ID
    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(
            @PathVariable Long id,
            @RequestBody Ingredient updatedIngredient
    ) {
        Ingredient result = ingredientService.updateIngredient(id, updatedIngredient);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkNameExists(@RequestParam String name) {
        boolean exists = ingredientService.existsByName(name);
        return ResponseEntity.ok(exists);
    }
    // Xóa nguyên liệu theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIngredient(@PathVariable Long id) {
        boolean deleted = ingredientService.deleteIngredient(id);
        if (deleted) {
            return ResponseEntity.ok("Nguyên liệu đã được xóa thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy nguyên liệu để xóa.");
        }
    }

}