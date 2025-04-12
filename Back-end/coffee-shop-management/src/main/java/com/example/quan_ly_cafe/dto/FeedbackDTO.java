package com.example.quan_ly_cafe.dto;

import lombok.Data;

@Data
public class FeedbackDTO {
    private Long id;
    private double rating;
    private String content;
    private String date;
}
