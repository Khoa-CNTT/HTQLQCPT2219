package com.example.quan_ly_cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCheckDTO {
    private Long productId;           // ID của sản phẩm muốn kiểm tra
    private Integer quantity;         // Số lượng muốn thêm vào giỏ
    private List<Long> toppingIds;    // Danh sách ID topping đã chọn
}
