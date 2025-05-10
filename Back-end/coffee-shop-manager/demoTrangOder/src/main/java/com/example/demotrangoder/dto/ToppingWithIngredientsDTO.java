package com.example.demotrangoder.dto;

import java.util.List;

public class ToppingWithIngredientsDTO {
    private Long id;
    private String name;
    private Double price;
    private List<IngredientDTO> ingredients;

    public ToppingWithIngredientsDTO(Long id, String name, Double price, List<IngredientDTO> ingredients) {
        this.id = id;
        this.name = name;
        this.price = price;
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

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public List<IngredientDTO> getIngredients() {
        return ingredients;
    }
}
