package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.Discount;
import com.example.quan_ly_cafe.repo.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DiscountService implements IDiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public Discount findByCode(String code) {
        Optional<Discount> discount = discountRepository.findByCode(code);
        return discount.orElse(null); // Trả về null nếu không tìm thấy
    }
    @Override
    public Page<Discount> findAll(Pageable pageable) {
        return discountRepository.findAll(pageable);
    }

    @Override
    public Page<Discount> searchByCodeOrValue(String code, Double value, Pageable pageable) {
        return discountRepository.searchByCodeOrValue(code, value, pageable);
    }
    @Override
    public Optional<Discount> findById(Long id) {
        return discountRepository.findById(id);
    }

    @Override
    public Discount update(Long id, Discount updatedDiscount) {
        return discountRepository.findById(id).map(existing -> {
            existing.setCode(updatedDiscount.getCode());
            existing.setValue(updatedDiscount.getValue());
            existing.setStatus(updatedDiscount.getStatus());
            return discountRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá với ID: " + id));
    }
    @Override
    public Discount save(Discount discount) {
        return discountRepository.save(discount);
    }
    @Override
    public boolean deleteById(Long id) {
        Optional<Discount> discountOpt = discountRepository.findById(id);
        if (discountOpt.isPresent()) {
            discountRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
