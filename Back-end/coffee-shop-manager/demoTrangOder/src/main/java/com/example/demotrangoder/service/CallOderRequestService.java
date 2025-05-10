package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.CallOderRequestDTO;
import com.example.demotrangoder.model.CallOderRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CallOderRequestService {
    List<CallOderRequestDTO> getAllCallOderRequestDTO();
    CallOderRequestDTO getCallOderRequestById(Long id);
    Page<CallOderRequestDTO> searchByIdWithPagination(Long id, int page, int size);
    Long countTodayOrders();
    Long countMonthlyOrders(); // 👈 Thêm dòng này để đếm hóa đơn trong tháng

}
