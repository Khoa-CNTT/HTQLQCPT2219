package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.OderDetailDTO1;
import com.example.demotrangoder.dto.OderDetailResponse;
import com.example.demotrangoder.model.OderDetail;

import java.util.List;

public interface IOderDetailService {
    List<OderDetail> getAllOrderDetails();
    List<OderDetailDTO1> getDetailsByCallOrderRequestId(Long callOderRequestId);

}
