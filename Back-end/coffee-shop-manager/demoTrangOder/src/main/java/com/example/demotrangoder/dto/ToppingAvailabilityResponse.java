package com.example.demotrangoder.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ToppingAvailabilityResponse {
    private String message;
    private List<String> unavailableToppings; // danh sách tên topping không đủ nguyên liệu

}
