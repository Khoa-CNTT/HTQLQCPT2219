package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Topping;
import com.example.demotrangoder.model.ToppingIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToppingIngredientRepository extends JpaRepository<ToppingIngredient, Long> {
    List<ToppingIngredient> findByToppingIdIn(List<Long> toppingIds);
    void deleteByTopping(Topping topping); // Xóa theo topping
    List<ToppingIngredient> findByToppingId(Long toppingId);

}
