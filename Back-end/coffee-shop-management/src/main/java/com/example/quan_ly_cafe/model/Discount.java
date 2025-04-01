package com.example.quan_ly_cafe.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code; // Mã giảm giá
    private Double value; // Giá trị giảm giá (phần trăm hoặc số tiền)
    private Boolean status;
    // Getters and Setters (đã được tạo tự động nhờ Lombok)
}
