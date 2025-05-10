package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    Page<Product> findAll(Pageable pageable);
    // Thêm phương thức để lấy sản phẩm theo mã danh mục
    Page<Product> findProductsByCategory(String categoryCode, Pageable pageable);
    Page<Product> searchProducts(String searchTerm, Pageable pageable);
    Page<Product> searchProductsByCategoryAndKeyword(String keyword, String categoryCode, int page, int size);
    Product save(Product product);
    Optional<Product> findById(Long id);
    Page<Product> searchByNameAndCode(String productName, String productCode, int page, int size);
    void deleteById(Long id);
    List<Product> getTop5BestSellingProducts();

}
