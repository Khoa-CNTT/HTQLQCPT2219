package com.example.quan_ly_cafe.controller;

import com.example.quan_ly_cafe.dto.ProductCheckDTO;
import com.example.quan_ly_cafe.model.ProductIngredient;
import com.example.quan_ly_cafe.service.IProductIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/check")
@CrossOrigin("*")
public class CheckController {

    @Autowired
    private IProductIngredientService productIngredientService;

    @PostMapping("/product-availability")
    public ResponseEntity<String> checkProductAvailability(@RequestBody ProductCheckDTO dto) {
        List<ProductIngredient> ingredients = productIngredientService.findByProductId(dto.getProductId());

        for (ProductIngredient pi : ingredients) {
            double totalRequired = pi.getAmountRequired() * dto.getQuantity();
            if (pi.getIngredient().getQuantityInStock() < totalRequired) {
                return ResponseEntity.ok("Sản phẩm không đủ nguyên liệu để làm.");
            }
        }

        return ResponseEntity.ok("Sản phẩm đủ nguyên liệu để làm.");
    }

}