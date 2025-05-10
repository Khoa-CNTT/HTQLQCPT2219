package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Feedback;
import com.example.demotrangoder.model.Table;
import com.example.demotrangoder.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    @PostMapping("/{callOrderId}")
    public ResponseEntity<String> addFeedback(@PathVariable Long callOrderId, @RequestBody Feedback feedback) { // Đổi từ int -> Long
        String result = feedbackService.addFeedback(callOrderId, feedback);
        if (result.contains("thành công")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
    @GetMapping("/hi")
    public ResponseEntity<String> hi() {
        return ResponseEntity.ok("hi");
    }
    @GetMapping("")
    public ResponseEntity<Page<Feedback>> findAllFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Feedback> feedbacks = feedbackService.findAll(pageable);

        return ResponseEntity.ok(feedbacks);  // ✅ Không phải feedbacks.getContent()
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        Optional<Feedback> table = feedbackService.findById(id);
        if (table.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        feedbackService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
    @GetMapping("/searchByDate")
    public ResponseEntity<Page<Feedback>> findFeedbackByDate(
            @RequestParam("date") String date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        // Chuyển đổi chuỗi date thành LocalDate
        LocalDate filterDate = LocalDate.parse(date);

        Pageable pageable = PageRequest.of(page, size);

        // Gọi phương thức trong service để tìm feedback theo ngày
        Page<Feedback> feedbacks = feedbackService.findByDate(filterDate, pageable);

        return ResponseEntity.ok(feedbacks);
    }
    @GetMapping("/top-feedbacks")
    public ResponseEntity<List<Feedback>> getTopFeedbacks() {
        List<Feedback> feedbacks = feedbackService.findTop4BestFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }



}
