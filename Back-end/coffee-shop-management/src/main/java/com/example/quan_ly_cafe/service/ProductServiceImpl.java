package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Product;
import com.example.quan_ly_cafe.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements IProductService{
    @Autowired
    private ProductRepository productRepository;
    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    // Thêm phương thức để lấy sản phẩm theo mã danh mục
    public Page<Product> findProductsByCategory(String categoryCode, Pageable pageable) {
        return productRepository.findByCategory_CategoryCode(categoryCode, pageable);
    }

    @Override
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.findByProductNameContainingIgnoreCase(searchTerm, pageable);

    }

    @Override
    public Page<Product> searchProductsByCategoryAndKeyword(String keyword, String categoryCode, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategory_CategoryCodeAndProductNameContaining(categoryCode, keyword, pageable);
    }

}
