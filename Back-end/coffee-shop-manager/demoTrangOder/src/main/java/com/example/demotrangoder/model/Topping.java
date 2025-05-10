package com.example.demotrangoder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Topping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;  // Tên topping (Ví dụ: Trân châu, Thạch)
    private Double price; // Giá của topping

    @JsonIgnore
    @OneToMany(mappedBy = "topping", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ToppingIngredient> toppingIngredients = new ArrayList<>();

}
