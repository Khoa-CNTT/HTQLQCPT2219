package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Topping;
import com.example.demotrangoder.service.ToppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/topping")
public class ToppingController {
    @Autowired
    private ToppingService toppingService;
    // Lấy tất cả topping
    @GetMapping("")
    public ResponseEntity<List<Topping>> getAllToppings() {
        List<Topping> toppings = toppingService.getAllToppings();
        return ResponseEntity.ok(toppings);
    }
    // ✅ Tìm kiếm topping theo tên
    @GetMapping("/search")
    public ResponseEntity<List<Topping>> searchToppingsByName(@RequestParam("name") String name) {
        List<Topping> results = toppingService.searchToppingsByName(name);
        return ResponseEntity.ok(results);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addTopping(@RequestBody Topping topping) {
        if (topping.getName() == null || topping.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên topping không được để trống");
        }

        if (toppingService.isToppingNameExists(topping.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Topping với tên '" + topping.getName() + "' đã tồn tại");
        }

        Topping savedTopping = toppingService.addTopping(topping);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTopping);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTopping(@PathVariable Long id, @RequestBody Topping updatedTopping) {
        if (updatedTopping.getName() == null || updatedTopping.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên topping không được để trống");
        }

        Optional<Topping> existing = toppingService.getToppingById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy topping với ID " + id);
        }

        // Kiểm tra trùng tên (trừ chính nó)
        if (toppingService.isToppingNameExistsExceptId(updatedTopping.getName(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Topping với tên '" + updatedTopping.getName() + "' đã tồn tại");
        }

        Topping topping = existing.get();
        topping.setName(updatedTopping.getName());
        topping.setPrice(updatedTopping.getPrice());

        Topping saved = toppingService.addTopping(topping);
        return ResponseEntity.ok(saved);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTopping(@PathVariable Long id) {
        Optional<Topping> existing = toppingService.getToppingById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy topping với ID " + id);
        }

        toppingService.deleteTopping(id);
        return ResponseEntity.ok("Đã xóa topping và các nguyên liệu liên kết trong bảng ToppingIngredient");
    }



}
