package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IDiscountService {
    Discount findByCode(String code);
    Page<Discount> findAll(Pageable pageable);
    Page<Discount> searchByCodeOrValue(String code, Double value, Pageable pageable);
    Optional<Discount> findById(Long id);
    Discount update(Long id, Discount updatedDiscount);
    Discount save(Discount discount);
    boolean deleteById(Long id);

}
