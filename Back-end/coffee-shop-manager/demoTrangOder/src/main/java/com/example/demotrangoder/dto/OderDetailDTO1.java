package com.example.demotrangoder.dto;

import com.example.demotrangoder.model.Discount;
import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.Size;
import com.example.demotrangoder.model.Topping;
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
