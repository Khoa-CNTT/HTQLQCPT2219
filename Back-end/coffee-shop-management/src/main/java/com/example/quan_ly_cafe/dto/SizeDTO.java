package com.example.quan_ly_cafe.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeDTO {
    private Long sizeId;
    private String sizeName;
    private Double price; // nếu có
}
