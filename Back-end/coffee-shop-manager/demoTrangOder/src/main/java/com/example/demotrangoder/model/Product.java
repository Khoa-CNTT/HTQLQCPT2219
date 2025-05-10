package com.example.demotrangoder.model;

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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String createAt;
    private String productCode;
    private String productImgUrl;
    private String productName;
    private Double productPrice;
    private String productStatus;
    private String updateDay;
    @ManyToMany
    @JoinTable(
            name = "product_topping",  // Tên bảng join
            joinColumns = @JoinColumn(name = "product_id"),  // Khoá ngoại của Product
            inverseJoinColumns = @JoinColumn(name = "topping_id")  // Khoá ngoại của Topping
    )
    private List<Topping> toppings;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String productDescription;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductIngredient> productIngredients;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<OderDetail> oderDetails;
    // Bạn có thể thêm một mối quan hệ với Size nếu muốn lưu trực tiếp kích thước trong Product

    // getters and setters
    public Product(Long productId) {
        this.productId = productId;
    }

}