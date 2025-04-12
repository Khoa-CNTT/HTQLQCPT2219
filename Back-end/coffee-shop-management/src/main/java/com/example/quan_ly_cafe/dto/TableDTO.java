package com.example.quan_ly_cafe.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TableDTO {
    private Long tableId;
    private String tableCode;
    private String tableName;
}
