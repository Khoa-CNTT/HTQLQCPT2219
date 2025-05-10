package com.example.demotrangoder.controller;

import com.example.demotrangoder.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyIncomeWithHourly() {
        LocalDate today = LocalDate.now();
        Map<String, Object> result = incomeService.getIncomeAndHourlyIncomeByDate(today);
        return ResponseEntity.ok(result);
    }


    @GetMapping("/weekly")
    public ResponseEntity<Map<String, Object>> getWeeklyIncome() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);
        Map<String, Object> result = incomeService.getIncomeByWeekWithDaily(startOfWeek, endOfWeek);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyIncome() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        Map<String, Object> result = incomeService.getIncomeByMonthWithDaily(startOfMonth, endOfMonth);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/yearly")
    public ResponseEntity<Map<String, Object>> getYearlyIncome() {
        LocalDate today = LocalDate.now();
        LocalDate startOfYear = today.withDayOfYear(1);
        LocalDate endOfYear = today.withDayOfYear(today.lengthOfYear());

        Map<String, Object> incomeData = incomeService.getIncomeByYear(startOfYear, endOfYear);
        return ResponseEntity.ok(incomeData);
    }

    @GetMapping("/custom")
    public ResponseEntity<Map<String, Object>> getIncomeByCustomRange(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        Map<String, Object> response = incomeService.getIncomeByCustomRange(fromDate, toDate);
        return ResponseEntity.ok(response);
    }

}

