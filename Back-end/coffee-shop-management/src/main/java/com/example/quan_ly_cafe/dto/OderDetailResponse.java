package com.example.quan_ly_cafe.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class OderDetailResponse {
    private Long oderDetailId;
    private int quantity;
    private String shippingDay;
    private Boolean status;
    private Double totalMoneyOder;
    private Long callOderRequestId;
    private String sizeName;
    private String productName;
    private Double discountValue;
    private String noteProduct;
    private List<String> toppingNames;
}
