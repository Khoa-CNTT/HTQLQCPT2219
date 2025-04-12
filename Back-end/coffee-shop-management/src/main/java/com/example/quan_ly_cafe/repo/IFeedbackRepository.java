package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface IFeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByDate(LocalDate date, Pageable pageable);

}
