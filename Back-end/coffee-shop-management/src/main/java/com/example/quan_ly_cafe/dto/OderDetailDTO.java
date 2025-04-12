package com.example.quan_ly_cafe.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OderDetailDTO {
    private Long oderDetailId;
    private int quantity;
    private String shippingDay;
    private Boolean status;
    private Double totalMoneyOder;
    private String noteProduct;
    private Product1DTO product;
    private DiscountDTO discount; // ➕ thêm dòng này
    private SizeDTO size; // ➕ Thêm dòng này
    private List<ToppingDTO> toppings; // ➕ Thêm dòng này


}
