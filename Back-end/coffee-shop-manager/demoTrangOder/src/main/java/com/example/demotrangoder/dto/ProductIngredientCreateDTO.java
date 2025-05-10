package com.example.demotrangoder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductIngredientCreateDTO {
    private String productName;
    private String ingredientName;
    private Double amountRequired;
}
