package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByDate(LocalDate date, Pageable pageable);
    List<Feedback> findTop4ByRatingAndContentIsNotNullAndReviewerNameIsNotNullOrderByDateDesc(Double rating);

}
