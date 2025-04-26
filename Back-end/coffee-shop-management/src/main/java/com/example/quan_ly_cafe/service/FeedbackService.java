package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.model.CallOderRequest;
import com.example.quan_ly_cafe.model.Feedback;
import com.example.quan_ly_cafe.repo.CallOderRequestRepository;
import com.example.quan_ly_cafe.repo.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService implements IFeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private CallOderRequestRepository callOderRequestRepository;
    @Override
    public String addFeedback(Long callOrderId, Feedback feedback) {
        System.out.println("🟢 Nhận đánh giá: " + feedback.getRating() + " - " + feedback.getContent());

        Optional<CallOderRequest> callOrderOpt = callOderRequestRepository.findById(callOrderId);
        if (callOrderOpt.isEmpty()) {
            return "Không tìm thấy đơn hàng!";
        }

        if (feedbackRepository.existsById(callOrderId)) {
            return "Đơn hàng này đã có Feedback!";
        }

        feedback.setCallOderRequest(callOrderOpt.get());
        feedback.setDate(LocalDate.now());
        feedbackRepository.save(feedback);

        System.out.println("🟢 Đánh giá đã lưu vào DB: " + feedback.getRating() + " - " + feedback.getContent());
        return "Thêm đánh giá thành công!";
    }

    @Override
    public Page<Feedback> findAll(Pageable pageable) {
        return feedbackRepository.findAll(pageable);
    }

    @Override
    public Optional<Feedback> findById(Long id) {
        return feedbackRepository.findById(id);

    }

    @Override
    public void deleteById(Long id) {
        feedbackRepository.deleteById(id);

    }
    @Override
    public Page<Feedback> findByDate(LocalDate date, Pageable pageable) {
        return feedbackRepository.findByDate(date, pageable);
    }
    @Override
    public List<Feedback> findTop4BestFeedbacks() {
        return feedbackRepository.findTop4ByRatingAndContentIsNotNullAndReviewerNameIsNotNullOrderByDateDesc(5.0);
    }


}

