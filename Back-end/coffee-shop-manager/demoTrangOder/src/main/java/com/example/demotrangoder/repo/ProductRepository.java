package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    Optional<Product> findByProductName(String productName);
    @Query("SELECT p FROM Product p " +
            "JOIN p.oderDetails od " +
            "GROUP BY p.productId " +
            "ORDER BY SUM(od.quantity) DESC")
    List<Product> findTop5BestSellingProducts(Pageable pageable);

}
