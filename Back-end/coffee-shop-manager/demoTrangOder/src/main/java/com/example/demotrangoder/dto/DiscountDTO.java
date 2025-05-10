package com.example.demotrangoder.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class DiscountDTO {
    private Long id;
    private String code;
    private Double value;
}
