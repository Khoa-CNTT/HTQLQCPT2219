package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, Long> {
    Optional<Topping> findByName(String name); // <-- Thêm dòng này
    List<Topping> findByNameContainingIgnoreCase(String name);

}
