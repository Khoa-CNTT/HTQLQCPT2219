package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Feedback;
import com.example.demotrangoder.model.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IFeedbackService {
    String addFeedback(Long callOrderId, Feedback feedback); // Đổi từ int -> Long
    Page<Feedback> findAll(Pageable pageable);
    Optional<Feedback> findById(Long id);
    void deleteById(Long id);
    Page<Feedback> findByDate(LocalDate date, Pageable pageable);
    List<Feedback> findTop4BestFeedbacks();

}
