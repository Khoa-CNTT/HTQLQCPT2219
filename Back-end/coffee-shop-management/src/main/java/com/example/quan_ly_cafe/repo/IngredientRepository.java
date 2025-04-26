package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Ingredient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Page<Ingredient> findByNameContainingIgnoreCase(String name, Pageable pageable);
    @Query("SELECT i FROM Ingredient i WHERE i.quantityInStock <= i.minimumStock")
    List<Ingredient> findLowStockIngredients();
    Optional<Ingredient> findById(Long id);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByName(String name);
    Optional<Ingredient> findByName(String name);

}