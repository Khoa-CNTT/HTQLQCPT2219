package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.ToppingAvailabilityRequest;
import com.example.demotrangoder.dto.ToppingAvailabilityResponse;

public interface ToppingAvailabilityService {
    ToppingAvailabilityResponse checkToppingAvailability(ToppingAvailabilityRequest request);

}
