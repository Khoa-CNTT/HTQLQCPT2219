package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public List<Product> getTop5BestSellingProducts() {
        return productRepository.findTop5BestSellingProducts(PageRequest.of(0, 5));
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
    // Phương thức lưu sản phẩm mới
    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }
    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    @Override
    public Page<Product> searchByNameAndCode(String productName, String productCode, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchByNameAndCode(productName, productCode, pageable);
    }
    @Override
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

}
