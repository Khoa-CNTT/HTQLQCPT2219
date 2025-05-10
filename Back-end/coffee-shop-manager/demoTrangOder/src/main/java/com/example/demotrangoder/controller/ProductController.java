package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Category;
import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/product")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private IProductService productService;
    @GetMapping("")
    public ResponseEntity<Page<Product>> findAllCategory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
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
    @GetMapping("/top-selling")
    public ResponseEntity<List<Product>> getTop5BestSelling() {
        return ResponseEntity.ok(productService.getTop5BestSellingProducts());
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
            @RequestParam(defaultValue = "4") int size) {

        Page<Product> products = productService.searchProductsByCategoryAndKeyword(keyword, category, page, size);
        return ResponseEntity.ok(products);
    }
    // Phương thức thêm mới sản phẩm
    @PostMapping("")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        // Kiểm tra nếu category có sẵn trong CSDL (optional, tùy thuộc vào yêu cầu của bạn)
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            return ResponseEntity.badRequest().body(null); // Hoặc có thể trả về lỗi khác
        }

        // Lưu sản phẩm mới
        Product savedProduct = productService.save(product);

        // Trả về sản phẩm đã được thêm
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }
    // Lấy sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> findProductById(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Optional<Product> existingProduct = productService.findById(id);
        if (existingProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = existingProduct.get();
        product.setProductName(updatedProduct.getProductName());
        product.setProductPrice(updatedProduct.getProductPrice());
        product.setProductImgUrl(updatedProduct.getProductImgUrl());
        product.setProductCode(updatedProduct.getProductCode());
        product.setCategory(updatedProduct.getCategory());

        Product saved = productService.save(product);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/searchByNameAndCode")
    public ResponseEntity<Page<Product>> searchByNameAndCode(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String productCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {

        Page<Product> products = productService.searchByNameAndCode(productName, productCode, page, size);
        return ResponseEntity.ok(products);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productService.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

}
