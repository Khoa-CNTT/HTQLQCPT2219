package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategory_CategoryCode(String categoryCode, Pageable pageable);
    Page<Product> findByProductNameContainingIgnoreCase(String searchTerm, Pageable pageable);
    Page<Product> findByCategory_CategoryCodeAndProductNameContaining(String categoryCode, String keyword, Pageable pageable);
    @Query("SELECT p FROM Product p WHERE " +
            "(:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
            "(:productCode IS NULL OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :productCode, '%')))")
    Page<Product> searchByNameAndCode(
            @Param("productName") String productName,
            @Param("productCode") String productCode,
            Pageable pageable);


}
