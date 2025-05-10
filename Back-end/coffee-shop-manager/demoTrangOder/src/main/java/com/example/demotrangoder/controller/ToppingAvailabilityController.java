package com.example.demotrangoder.controller;

import com.example.demotrangoder.dto.ToppingAvailabilityRequest;
import com.example.demotrangoder.dto.ToppingAvailabilityResponse;
import com.example.demotrangoder.service.ToppingAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/check")
@CrossOrigin(origins = "*")
public class ToppingAvailabilityController {

    @Autowired
    private ToppingAvailabilityService toppingAvailabilityService;

    @PostMapping("/topping-availability")
    public ToppingAvailabilityResponse checkToppingAvailability(@RequestBody ToppingAvailabilityRequest request) {
        return toppingAvailabilityService.checkToppingAvailability(request);
    }
}