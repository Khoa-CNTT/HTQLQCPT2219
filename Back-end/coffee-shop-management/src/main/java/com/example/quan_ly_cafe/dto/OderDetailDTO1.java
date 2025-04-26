package com.example.quan_ly_cafe.dto;

import com.example.quan_ly_cafe.model.Discount;
import com.example.quan_ly_cafe.model.Product;
import com.example.quan_ly_cafe.model.Size;
import com.example.quan_ly_cafe.model.Topping;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OderDetailDTO1 {
    private Long oderDetailId;
    private int quantity;
    private String shippingDay;
    private Boolean status;
    private Double totalMoneyOder;
    private String noteProduct;

    private Product product;
    private Size size;
    private Discount discount;
    private List<Topping> toppings;

}
