package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Topping;

import java.util.List;
import java.util.Optional;

public interface ToppingService {
    List<Topping> getAllToppings();
    List<Topping> searchToppingsByName(String name);
    Topping addTopping(Topping topping);
    boolean isToppingNameExists(String name);
    Optional<Topping> getToppingById(Long id);
    boolean isToppingNameExistsExceptId(String name, Long id);
    void deleteTopping(Long id);

}
