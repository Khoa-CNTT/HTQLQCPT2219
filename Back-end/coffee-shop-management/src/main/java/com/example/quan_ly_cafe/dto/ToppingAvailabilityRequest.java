package com.example.quan_ly_cafe.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ToppingAvailabilityRequest {
    private int quantity;  // Số lượng topping người dùng chọn
    private List<Long> toppingIds; // Danh sách toppingId người dùng chọn
}
