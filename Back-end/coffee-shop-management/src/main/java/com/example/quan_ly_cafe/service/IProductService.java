package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
    Page<Product> findAll(Pageable pageable);
    // Thêm phương thức để lấy sản phẩm theo mã danh mục
    Page<Product> findProductsByCategory(String categoryCode, Pageable pageable);
    Page<Product> searchProducts(String searchTerm, Pageable pageable);
    Page<Product> searchProductsByCategoryAndKeyword(String keyword, String categoryCode, int page, int size);
}
