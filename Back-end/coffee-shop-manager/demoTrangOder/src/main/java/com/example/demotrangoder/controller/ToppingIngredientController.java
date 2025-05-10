package com.example.demotrangoder.controller;

import com.example.demotrangoder.dto.ToppingIngredientCreateDTO;
import com.example.demotrangoder.dto.ToppingWithIngredientsDTO;
import com.example.demotrangoder.model.Topping;
import com.example.demotrangoder.repo.ToppingRepository;
import com.example.demotrangoder.service.IToppingIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/topping-ingredients")
public class ToppingIngredientController {

    @Autowired
    private IToppingIngredientService toppingIngredientService;
    @Autowired
    private ToppingRepository toppingRepository;
    @GetMapping("/all")
    public ResponseEntity<List<ToppingWithIngredientsDTO>> getAllToppings() {
        return ResponseEntity.ok(toppingIngredientService.getAllToppingWithIngredients());
    }
    @PutMapping("/update/{toppingId}")
    public ResponseEntity<?> updateToppingIngredients(@PathVariable Long toppingId,
                                                      @RequestBody ToppingWithIngredientsDTO dto) {
        try {
            if (!toppingId.equals(dto.getId())) {
                return ResponseEntity.badRequest().body("toppingId không khớp.");
            }

            Topping updated = toppingIngredientService.updateToppingIngredients(toppingId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteIngredientFromTopping(@RequestParam Long toppingId, @RequestParam String ingredientName) {
        try {
            toppingIngredientService.deleteIngredientFromTopping(toppingId, ingredientName);
            return ResponseEntity.ok("Nguyên liệu đã được xóa khỏi topping.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/add")
    public ResponseEntity<?> addToppingIngredient(@RequestBody ToppingIngredientCreateDTO dto) {
        try {
            System.out.println("===> DTO RECEIVED:");
            System.out.println("Topping name: " + dto.getToppingName());
            System.out.println("Ingredient name: " + dto.getIngredientName());
            System.out.println("Amount required: " + dto.getAmountRequired());
            toppingIngredientService.createToppingIngredient(dto);
            return ResponseEntity.ok("Thêm nguyên liệu vào topping thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/check")
    public ResponseEntity<?> checkToppingExist(@RequestParam String name) {
        boolean exists = toppingRepository.findByName(name).isPresent();
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

}
