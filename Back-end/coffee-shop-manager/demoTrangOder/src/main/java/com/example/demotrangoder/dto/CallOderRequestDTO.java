package com.example.demotrangoder.dto;

import lombok.*;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CallOderRequestDTO {
    private Long id;
    private Double totalPrice;
    private String paymentStatus;
    private TableDTO table;
    private FeedbackDTO feedback;
    private List<OderDetailDTO> oderDetails;

}
