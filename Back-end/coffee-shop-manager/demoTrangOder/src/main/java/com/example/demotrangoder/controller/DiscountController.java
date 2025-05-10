package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Discount;
import com.example.demotrangoder.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discounts")
@CrossOrigin("*")
public class DiscountController {
    @Autowired
    private DiscountService discountService;
    @GetMapping("/{code}")
    public ResponseEntity<?> checkDiscount(@PathVariable String code) {
        Discount discount = discountService.findByCode(code);
        if (discount != null) {
            if (discount.getStatus()) { // Giả sử bạn kiểm tra trạng thái của mã
                return ResponseEntity.ok(discount);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã giảm giá không còn hiệu lực.");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Mã giảm giá không tồn tại.");
    }
    // Hiển thị tất cả (phân trang)
    @GetMapping
    public Page<Discount> getAllDiscounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size
    ) {
        return discountService.findAll(PageRequest.of(page, size));
    }

    // Tìm kiếm theo code (có phân trang)
    @GetMapping("/search")
    public Page<Discount> searchDiscounts(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Double value,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return discountService.searchByCodeOrValue(code == null ? "" : code, value, PageRequest.of(page, size));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscount(@PathVariable Long id, @RequestBody Discount updatedDiscount) {
        try {
            Discount updated = discountService.update(id, updatedDiscount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody Discount discount) {
        Discount savedDiscount = discountService.save(discount);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDiscount);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        try {
            boolean deleted = discountService.deleteById(id);
            if (deleted) {
                return ResponseEntity.ok("Xóa mã giảm giá thành công.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy mã giảm giá để xóa.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa mã giảm giá.");
        }
    }

}
