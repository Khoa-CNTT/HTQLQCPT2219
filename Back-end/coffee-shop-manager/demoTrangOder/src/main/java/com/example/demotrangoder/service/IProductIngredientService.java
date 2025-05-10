package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ProductIngredientCreateDTO;
import com.example.demotrangoder.dto.ProductWithIngredientsDTO;
import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.ProductIngredient;

import java.util.List;

public interface IProductIngredientService {
    List<ProductIngredient> findByProductId(Long productId);
    List<ProductWithIngredientsDTO> getAllProductWithIngredients();
    Product updateProductIngredients(Long productId, ProductWithIngredientsDTO updatedProduct);
    void createProductIngredient(ProductIngredientCreateDTO dto); // ➕ mới
    void deleteIngredientFromProduct(Long productId, String ingredientName);
    void deleteProductAndIngredients(Long productId);

}