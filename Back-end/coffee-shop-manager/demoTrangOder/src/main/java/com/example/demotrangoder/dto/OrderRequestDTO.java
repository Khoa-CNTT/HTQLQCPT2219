package com.example.demotrangoder.dto;

import com.example.demotrangoder.model.Table;
import com.example.demotrangoder.model.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    private Users user;
    private Table table;
    private List<ProductDTO> products;
    private String code;  // Thêm trường discountCode để chứa mã giảm giá
    private Double totalPrice;
    private String paymentStatus;
    @Override
    public String toString() {
        return "OrderRequestDTO{" +
                "user='" + user + '\'' +
                ", table='" + table + '\'' +
                ", products=" + products +
                '}';
    }
}
