package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IngredientService {
    Page<Ingredient> getAllIngredients(Pageable pageable);
    Page<Ingredient> searchIngredients(String keyword, Pageable pageable);
    List<Ingredient> findLowStockIngredients(); // 👈 Thêm dòng này
    Ingredient updateIngredient(Long id, Ingredient updatedIngredient); // Thêm dòng này
    boolean existsByName(String name); // ✅ Interface bổ sung nè
    Ingredient addIngredient(Ingredient ingredient);
    boolean deleteIngredient(Long id); // Thêm phương thức xóa

}
