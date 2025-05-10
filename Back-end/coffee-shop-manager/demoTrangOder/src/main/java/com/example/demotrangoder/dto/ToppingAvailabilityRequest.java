package com.example.demotrangoder.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ToppingAvailabilityRequest {
    private Map<Long, Integer> toppingQuantities; // key: toppingId, value: tổng số lượng topping
}
