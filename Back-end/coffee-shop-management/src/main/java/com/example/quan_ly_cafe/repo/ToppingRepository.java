package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, Long> {

}
