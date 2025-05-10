package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.repo.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;
    // Thêm mới nguyên liệu
    @Override
    public Ingredient addIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient); // lưu nguyên liệu vào DB
    }
    @Override
    public Page<Ingredient> getAllIngredients(Pageable pageable) {
        return ingredientRepository.findAll(pageable);
    }

    @Override
    public Page<Ingredient> searchIngredients(String keyword, Pageable pageable) {
        return ingredientRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }
    @Override
    public List<Ingredient> findLowStockIngredients() {
        return ingredientRepository.findLowStockIngredients();
    }
    @Override
    public Ingredient updateIngredient(Long id, Ingredient updatedIngredient) {
        Ingredient existing = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu với ID: " + id));

        existing.setName(updatedIngredient.getName());
        existing.setQuantityInStock(updatedIngredient.getQuantityInStock());
        existing.setMinimumStock(updatedIngredient.getMinimumStock());
        existing.setUnit(updatedIngredient.getUnit());

        return ingredientRepository.save(existing);
    }
    @Override
    public boolean existsByName(String name) {
        return ingredientRepository.existsByNameIgnoreCase(name);
    }
    @Override
    public boolean deleteIngredient(Long id) {
        if (ingredientRepository.existsById(id)) {
            ingredientRepository.deleteById(id);
            return true;
        }
        return false;  // Trả về false nếu không tìm thấy nguyên liệu để xóa
    }
}