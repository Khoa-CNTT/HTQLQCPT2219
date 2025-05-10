package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ToppingIngredientCreateDTO;
import com.example.demotrangoder.dto.ToppingWithIngredientsDTO;
import com.example.demotrangoder.model.Topping;

import java.util.List;

public interface IToppingIngredientService {
    List<ToppingWithIngredientsDTO> getAllToppingWithIngredients();
    Topping updateToppingIngredients(Long toppingId, ToppingWithIngredientsDTO dto);
    void createToppingIngredient(ToppingIngredientCreateDTO dto);
    void deleteIngredientFromTopping(Long toppingId, String ingredientName);

}
