package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ToppingIngredientCreateDTO;
import com.example.demotrangoder.dto.ToppingWithIngredientsDTO;
import com.example.demotrangoder.model.Ingredient;
import com.example.demotrangoder.model.Topping;
import com.example.demotrangoder.model.ToppingIngredient;
import com.example.demotrangoder.repo.IngredientRepository;
import com.example.demotrangoder.repo.ToppingIngredientRepository;
import com.example.demotrangoder.repo.ToppingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ToppingIngredientService implements IToppingIngredientService {
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private ToppingRepository toppingRepository;
    @Autowired
    private ToppingIngredientRepository toppingIngredientRepository;
    @Override
    public void deleteIngredientFromTopping(Long toppingId, String ingredientName) {
        Optional<Topping> toppingOpt = toppingRepository.findById(toppingId);
        if (!toppingOpt.isPresent()) {
            throw new RuntimeException("Topping không tồn tại");
        }

        Topping topping = toppingOpt.get();

        Optional<Ingredient> ingredientOpt = ingredientRepository.findByName(ingredientName);
        if (!ingredientOpt.isPresent()) {
            throw new RuntimeException("Nguyên liệu không tồn tại");
        }
        System.out.println("Topping ID: " + toppingId);
        System.out.println("Ingredient Name: " + ingredientName);

        Ingredient ingredient = ingredientOpt.get();

        // Tìm ToppingIngredient cần xóa
        ToppingIngredient toppingIngredient = topping.getToppingIngredients()
                .stream()
                .filter(ti -> ti.getIngredient().equals(ingredient))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nguyên liệu không tìm thấy trong topping"));

        // Xóa khỏi danh sách và database
        topping.getToppingIngredients().remove(toppingIngredient);
        toppingIngredientRepository.delete(toppingIngredient);
    }
    @Override
    public List<ToppingWithIngredientsDTO> getAllToppingWithIngredients() {
        List<Topping> toppings = toppingRepository.findAll();

        return toppings.stream()
                .map(topping -> {
                    List<ToppingWithIngredientsDTO.IngredientDTO> ingredients = topping.getToppingIngredients().stream()
                            .map(ti -> new ToppingWithIngredientsDTO.IngredientDTO(
                                    ti.getIngredient().getName(),
                                    ti.getAmountRequired()
                            )).collect(Collectors.toList());

                    return new ToppingWithIngredientsDTO(
                            topping.getId(),
                            topping.getName(),
                            topping.getPrice(),
                            ingredients
                    );
                })
                .collect(Collectors.toList());
    }
    @Override
    public Topping updateToppingIngredients(Long toppingId, ToppingWithIngredientsDTO dto) {
        Optional<Topping> toppingOpt = toppingRepository.findById(toppingId);
        if (!toppingOpt.isPresent()) {
            throw new RuntimeException("Topping không tồn tại.");
        }

        Topping topping = toppingOpt.get();
        List<String> errors = new ArrayList<>();

        for (ToppingWithIngredientsDTO.IngredientDTO ingredientDTO : dto.getIngredients()) {
            Optional<Ingredient> ingredientOpt = ingredientRepository.findByName(ingredientDTO.getName());
            if (!ingredientOpt.isPresent()) {
                errors.add("Nguyên liệu '" + ingredientDTO.getName() + "' không tồn tại.");
                continue;
            }

            Ingredient ingredient = ingredientOpt.get();

            for (ToppingIngredient toppingIngredient : topping.getToppingIngredients()) {
                if (toppingIngredient.getIngredient().getName().equals(ingredient.getName())) {
                    toppingIngredient.setAmountRequired(ingredientDTO.getAmount());
                    toppingIngredientRepository.save(toppingIngredient);
                }
            }
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException(String.join("||", errors));
        }

        topping.setPrice(dto.getPrice()); // Cho phép cập nhật giá topping nếu cần
        return toppingRepository.save(topping);
    }
    @Override
    public void createToppingIngredient(ToppingIngredientCreateDTO dto) {
        Topping topping = toppingRepository.findByName(dto.getToppingName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy topping: " + dto.getToppingName()));

        Ingredient ingredient = ingredientRepository.findByName(dto.getIngredientName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu: " + dto.getIngredientName()));

        // Kiểm tra trùng
        boolean exists = topping.getToppingIngredients().stream()
                .anyMatch(ti -> ti.getIngredient().getName().equals(ingredient.getName()));
        if (exists) {
            throw new RuntimeException("Nguyên liệu đã tồn tại trong topping này.");
        }

        // Debug log
        System.out.println("Topping: " + topping.getName() + " (ID: " + topping.getId() + ")");
        System.out.println("Nguyên liệu: " + ingredient.getName() + " (ID: " + ingredient.getId() + ")");
        System.out.println("Định lượng: " + dto.getAmountRequired());

        ToppingIngredient toppingIngredient = new ToppingIngredient();
        toppingIngredient.setTopping(topping);
        toppingIngredient.setIngredient(ingredient);
        toppingIngredient.setAmountRequired(dto.getAmountRequired());

        toppingIngredientRepository.save(toppingIngredient);
    }

}
