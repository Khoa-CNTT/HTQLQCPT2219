package com.example.quan_ly_cafe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Setter
@Getter
@Entity
public class CallOderRequest {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = true) // Cho phép giá trị null
    @JoinColumn(name = "user_id", nullable = true) // nullable = true cho phép giá trị null trong database
    private Users user;

    private Double totalPrice;
    private String paymentStatus;
    @ManyToOne
    @JoinColumn(name = "table_id")
    private Table table;

    @OneToMany(mappedBy = "callOderRequest")
    @JsonIgnore
//    @JsonManagedReference
    private List<OderDetail> oderDetails;
    // Quan hệ 1-1 với Feedback
    @OneToOne(mappedBy = "callOderRequest", cascade = CascadeType.ALL)
    private Feedback feedback;
    // getters and setters
}