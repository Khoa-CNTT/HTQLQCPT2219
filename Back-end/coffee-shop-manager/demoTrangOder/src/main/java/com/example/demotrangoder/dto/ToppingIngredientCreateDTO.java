package com.example.demotrangoder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ToppingIngredientCreateDTO {
    private String toppingName;
    private String ingredientName;
    private Double amountRequired;

}
