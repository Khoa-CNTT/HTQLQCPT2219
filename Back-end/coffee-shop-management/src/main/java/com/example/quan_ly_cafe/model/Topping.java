package com.example.quan_ly_cafe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @OneToMany(mappedBy = "topping", cascade = CascadeType.ALL)
    private List<ToppingIngredient> toppingIngredients;
}
