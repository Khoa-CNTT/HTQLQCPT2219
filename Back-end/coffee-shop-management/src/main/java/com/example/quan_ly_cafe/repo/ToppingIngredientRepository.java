package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.ToppingIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToppingIngredientRepository extends JpaRepository<ToppingIngredient, Long> {
    List<ToppingIngredient> findByToppingIdIn(List<Long> toppingIds);
}
