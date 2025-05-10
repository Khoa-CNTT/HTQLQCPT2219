package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ToppingAvailabilityRequest;
import com.example.demotrangoder.dto.ToppingAvailabilityResponse;
import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.model.ToppingIngredient;
import com.example.demotrangoder.repo.IngredientRepository;
import com.example.demotrangoder.repo.ToppingIngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ToppingAvailabilityServiceImpl implements ToppingAvailabilityService {

    @Autowired
    private ToppingIngredientRepository toppingIngredientRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Override
    public ToppingAvailabilityResponse checkToppingAvailability(ToppingAvailabilityRequest request) {
        Map<Long, Integer> toppingQuantities = request.getToppingQuantities();
        List<ToppingIngredient> toppingIngredients = toppingIngredientRepository.findByToppingIdIn(new ArrayList<>(toppingQuantities.keySet()));

        Map<Long, String> toppingNames = new HashMap<>();

        for (ToppingIngredient ti : toppingIngredients) {
            Long toppingId = ti.getTopping().getId();
            String toppingName = ti.getTopping().getName();
            Ingredient ingredient = ti.getIngredient();

            int toppingQuantity = toppingQuantities.getOrDefault(toppingId, 0);
            double requiredAmount = ti.getAmountRequired() * toppingQuantity;

            if (ingredient.getQuantityInStock() < requiredAmount) {
                toppingNames.put(toppingId, toppingName);
            }
        }

        ToppingAvailabilityResponse response = new ToppingAvailabilityResponse();
        if (toppingNames.isEmpty()) {
            response.setMessage("Topping đủ nguyên liệu.");
            response.setUnavailableToppings(Collections.emptyList());
        } else {
            response.setMessage("Một số topping không đủ nguyên liệu.");
            response.setUnavailableToppings(new ArrayList<>(toppingNames.values()));
        }

        return response;
    }

}
