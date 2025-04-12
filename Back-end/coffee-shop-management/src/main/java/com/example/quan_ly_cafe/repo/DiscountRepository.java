package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Optional<Discount> findByCode(String code);
    @Query("SELECT d FROM Discount d " +
            "WHERE (:code IS NULL OR d.code LIKE %:code%) " +
            "AND (:value IS NULL OR d.value = :value)")
    Page<Discount> searchByCodeOrValue(@Param("code") String code,
                                       @Param("value") Double value,
                                       Pageable pageable);

}
