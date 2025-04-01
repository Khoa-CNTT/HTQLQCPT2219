package com.example.quan_ly_cafe.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double rating;
    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDate date;
    @OneToOne
    @JoinColumn(name = "call_order_request_id", unique = true) // Khóa ngoại
    @JsonIgnore
    private CallOderRequest callOderRequest;
}
