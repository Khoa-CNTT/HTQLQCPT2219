package com.example.quan_ly_cafe.controller;

import com.example.quan_ly_cafe.dto.ProductIngredientCreateDTO;
import com.example.quan_ly_cafe.dto.ProductWithIngredientsDTO;
import com.example.quan_ly_cafe.model.Product;
import com.example.quan_ly_cafe.service.IProductIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-ingredients")
public class ProductIngredientController {
    @Autowired
    private IProductIngredientService productIngredientService;
    // Lấy tất cả thông tin ProductIngredient
    @GetMapping("/all")
    public ResponseEntity<List<ProductWithIngredientsDTO>> getAll() {
        return ResponseEntity.ok(productIngredientService.getAllProductWithIngredients());
    }
    @DeleteMapping("/delete-product/{productId}")
    public ResponseEntity<?> deleteProductAndIngredients(@PathVariable Long productId) {
        try {
            productIngredientService.deleteProductAndIngredients(productId);
            return ResponseEntity.ok("Sản phẩm và các nguyên liệu liên quan đã được xoá.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật sản phẩm và nguyên liệu
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateProductIngredients(@PathVariable Long productId,
                                                      @RequestBody ProductWithIngredientsDTO updatedProduct) {
        try {
            // Kiểm tra xem productId trong URL có khớp với productId trong body không
            if (!productId.equals(updatedProduct.getProductId())) {
                return ResponseEntity.badRequest().body("productId không khớp.");
            }

            Product product = productIngredientService.updateProductIngredients(productId, updatedProduct);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            // Trả về lỗi cụ thể thay vì chỉ trả null
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Xóa nguyên liệu khỏi sản phẩm
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteIngredientFromProduct(@RequestParam Long productId, @RequestParam String ingredientName) {
        try {
            productIngredientService.deleteIngredientFromProduct(productId, ingredientName);
            return ResponseEntity.ok("Nguyên liệu đã được xóa khỏi sản phẩm.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // controller/ProductIngredientController.java
    @PostMapping("/add")
    public ResponseEntity<?> addProductIngredient(@RequestBody ProductIngredientCreateDTO dto) {
        try {
            productIngredientService.createProductIngredient(dto);
            return ResponseEntity.ok("Thêm nguyên liệu vào sản phẩm thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
