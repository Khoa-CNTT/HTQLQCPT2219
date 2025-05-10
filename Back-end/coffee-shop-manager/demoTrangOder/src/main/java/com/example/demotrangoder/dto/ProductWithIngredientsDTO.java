package com.example.demotrangoder.dto;

import lombok.Setter;

import java.util.List;

public class ProductWithIngredientsDTO {
    private String productName;
    private List<IngredientDTO> ingredients;
    @Setter
    private Long productId;  // Thêm trường này

    public Long getProductId() {
        return productId;
    }

    // Constructors, Getters, Setters

    public ProductWithIngredientsDTO(Long productId, String productName, List<IngredientDTO> ingredients) {
        this.productId = productId;
        this.productName = productName;
        this.ingredients = ingredients;
    }


    public static class IngredientDTO {
        private String name;
        private Double amount;

        public IngredientDTO(String name, Double amount) {
            this.name = name;
            this.amount = amount;
        }

        public String getName() {
            return name;
        }

        public Double getAmount() {
            return amount;
        }
    }

    public String getProductName() {
        return productName;
    }

    public List<IngredientDTO> getIngredients() {
        return ingredients;
    }
}
