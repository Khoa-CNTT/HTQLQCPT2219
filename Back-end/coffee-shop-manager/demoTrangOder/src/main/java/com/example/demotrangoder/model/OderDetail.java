package com.example.demotrangoder.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "oder_detail")  // Chỉ định rõ tên bảng trong cơ sở dữ liệu

public class OderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long oderDetailId;
    private int quantity;
    @Column(name = "shipping_day")  // Đảm bảo rằng tên cột trùng với tên cột trong bảng (shipping_day trong DB)
    private String shippingDay;
    private Boolean status;
    private Double totalMoneyOder;

    @ManyToOne
    @JoinColumn(name = "call_oder_request_id")
//    @JsonBackReference
    private CallOderRequest callOderRequest;
    @ManyToOne
    @JoinColumn(name = "size_id") // Tham chiếu đến bảng Size
    private Size size;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "discount_id") // Tham chiếu đến bảng Discount
    private Discount discount;
    // getters and setters
    private String noteProduct;
    @ManyToMany
    @JoinTable(
            name = "oder_detail_topping",
            joinColumns = @JoinColumn(name = "oder_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    private List<Topping> toppings; // Các topping kèm theo cho sản phẩm
}