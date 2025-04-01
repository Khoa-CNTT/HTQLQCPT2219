package com.example.quan_ly_cafe.controller;

import com.example.quan_ly_cafe.model.Product;
import com.example.quan_ly_cafe.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/product")
@CrossOrigin(origins = "*")

public class ProductController {
    @Autowired
    private IProductService productService;
    @GetMapping("")
    public ResponseEntity<Page<Product>> findAllCategory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }
    // Thêm API để lấy sản phẩm theo mã danh mục
    @GetMapping("/category/{categoryCode}")
    public ResponseEntity<Page<Product>> findProductsByCategory(
            @PathVariable String categoryCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "60") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.findProductsByCategory(categoryCode, pageable);
        return ResponseEntity.ok(products);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String searchTerm,
            @RequestParam int page,
            @RequestParam int size
    ) {
        Page<Product> products = productService.searchProducts(searchTerm, PageRequest.of(page, size));
        return ResponseEntity.ok(products);
    }
    @GetMapping("/searchCategory")
    public ResponseEntity<Page<Product>> searchProductsByCategory(
            @RequestParam String keyword,
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {

        Page<Product> products = productService.searchProductsByCategoryAndKeyword(keyword, category, page, size);
        return ResponseEntity.ok(products);
    }
}
