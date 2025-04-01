package com.example.quan_ly_cafe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    private String categoryCode;
    private String categoryImgUrl;
    private String categoryName;
    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Product> products;

    // getters and setters
}