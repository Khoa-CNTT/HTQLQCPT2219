package com.example.demotrangoder.service;

import com.example.demotrangoder.model.OderDetail;
import com.example.demotrangoder.repo.OderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OderDetailService {
    @Autowired
    private OderDetailRepository oderDetailRepository;
    public OderDetailService(OderDetailRepository oderDetailRepository) {
        this.oderDetailRepository = oderDetailRepository;
    }

    public List<OderDetail> getOrderDetailsByTableId(Long tableId) {
        return oderDetailRepository.findByCallOderRequest_Table_TableId(tableId);
    }
}
