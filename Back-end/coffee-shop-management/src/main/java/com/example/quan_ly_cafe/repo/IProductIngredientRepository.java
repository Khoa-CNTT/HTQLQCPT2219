package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IProductIngredientRepository extends JpaRepository<ProductIngredient, Long> {
    List<ProductIngredient> findByProductProductId(Long productId);
}