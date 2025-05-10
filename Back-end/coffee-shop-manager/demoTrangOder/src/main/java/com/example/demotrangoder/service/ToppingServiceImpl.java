package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Topping;
import com.example.demotrangoder.model.ToppingIngredient;
import com.example.demotrangoder.repo.IngredientRepository;
import com.example.demotrangoder.repo.OderDetailRepository;
import com.example.demotrangoder.repo.ToppingIngredientRepository;
import com.example.demotrangoder.repo.ToppingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ToppingServiceImpl implements ToppingService {
    @Autowired
    private ToppingRepository toppingRepository;
    @Autowired
    private ToppingIngredientRepository toppingIngredientRepository;
    @Autowired
    private OderDetailRepository orderDetailToppingRepository;
    @Override
    public List<Topping> getAllToppings() {
        return toppingRepository.findAll();
    }
    @Override
    public List<Topping> searchToppingsByName(String name) {
        return toppingRepository.findByNameContainingIgnoreCase(name);
    }
    @Override
    public Topping addTopping(Topping topping) {
        return toppingRepository.save(topping);
    }

    @Override
    public boolean isToppingNameExists(String name) {
        return toppingRepository.findByName(name).isPresent();
    }
    @Override
    public Optional<Topping> getToppingById(Long id) {
        return toppingRepository.findById(id);
    }

    @Override
    public boolean isToppingNameExistsExceptId(String name, Long id) {
        Optional<Topping> topping = toppingRepository.findByName(name);
        return topping.isPresent() && !topping.get().getId().equals(id);
    }
    @Autowired
    private IngredientRepository ingredientRepository; // Cần có repository này

    @Override
    @Transactional
    public void deleteTopping(Long id) {
        Optional<Topping> toppingOptional = toppingRepository.findById(id);
        if (toppingOptional.isPresent()) {
            Topping topping = toppingOptional.get();

            // Xóa các order detail topping trước
            orderDetailToppingRepository.deleteToppingReferences(topping.getId());

            // Xóa các topping ingredient
            toppingIngredientRepository.deleteByTopping(topping);

            // Xóa chính topping
            toppingRepository.delete(topping);
        }
    }


}
