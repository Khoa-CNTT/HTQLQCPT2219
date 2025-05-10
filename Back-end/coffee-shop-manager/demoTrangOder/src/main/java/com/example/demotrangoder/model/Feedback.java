package com.example.demotrangoder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
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
    private String reviewerName; // 👈 THÊM TRƯỜNG NÀY

    @OneToOne
    @JoinColumn(name = "call_order_request_id", unique = true) // Khóa ngoại
    @JsonIgnore
    private CallOderRequest callOderRequest;
}
