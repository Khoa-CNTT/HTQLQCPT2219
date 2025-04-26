package com.example.quan_ly_cafe.service;

import com.example.quan_ly_cafe.dto.OderDetailDTO1;
import com.example.quan_ly_cafe.model.OderDetail;

import java.util.List;

public interface IOderDetailService {
    List<OderDetail> getAllOrderDetails();
    List<OderDetailDTO1> getDetailsByCallOrderRequestId(Long callOderRequestId);

}
