package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.dto.ProductIngredientCreateDTO;
import com.example.quan_ly_cafe.dto.ProductWithIngredientsDTO;
import com.example.quan_ly_cafe.model.Product;
import com.example.quan_ly_cafe.model.ProductIngredient;

import java.util.List;

public interface IProductIngredientService {
    List<ProductIngredient> findByProductId(Long productId);
    List<ProductWithIngredientsDTO> getAllProductWithIngredients();
    Product updateProductIngredients(Long productId, ProductWithIngredientsDTO updatedProduct);
    void createProductIngredient(ProductIngredientCreateDTO dto); // ➕ mới
    void deleteIngredientFromProduct(Long productId, String ingredientName);
    void deleteProductAndIngredients(Long productId);

}