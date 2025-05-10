package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IProductIngredientRepository extends JpaRepository<ProductIngredient, Long> {
    List<ProductIngredient> findByProductProductId(Long productId);
    List<ProductIngredient> findByProduct_ProductId(Long productId);
    boolean existsByProductAndIngredient(Product product, Ingredient ingredient);
    void deleteByProductProductIdAndIngredientName(Long productId, String ingredientName);

}