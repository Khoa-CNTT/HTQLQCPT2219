package com.example.demotrangoder.dto;

import com.example.demotrangoder.model.Topping;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private String shippingDay;
    private Long sizeId; // ID của kích thước được chọn
    private Long discountId;
    private String productDescription;
    private String noteProduct;
    private List<Topping> toppings; // Danh sách topping

    @Override
    public String toString() {
        return "ProductDTO{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", shippingDay='" + shippingDay + '\'' +
                ", sizeId=" + sizeId +
                ", discountId=" + discountId +
                '}';
    }
}
