package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.OderDetailDTO;
import com.example.demotrangoder.dto.OderDetailDTO1;
import com.example.demotrangoder.dto.OderDetailResponse;
import com.example.demotrangoder.model.OderDetail;
import com.example.demotrangoder.repo.OderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OderDetailServiceImpl implements IOderDetailService{
    @Autowired
    private OderDetailRepository oderDetailRepository;
    @Override
    public List<OderDetail> getAllOrderDetails() {
        return oderDetailRepository.findAll();
    }
    @Override
    public List<OderDetailDTO1> getDetailsByCallOrderRequestId(Long callOderRequestId) {
        List<OderDetail> details = oderDetailRepository.findByCallOderRequestId(callOderRequestId);

        return details.stream().map(od -> {
            OderDetailDTO1 dto = new OderDetailDTO1();
            dto.setOderDetailId(od.getOderDetailId());
            dto.setQuantity(od.getQuantity());
            dto.setShippingDay(od.getShippingDay());
            dto.setStatus(od.getStatus());
            dto.setTotalMoneyOder(od.getTotalMoneyOder());
            dto.setNoteProduct(od.getNoteProduct());
            dto.setProduct(od.getProduct());
            dto.setSize(od.getSize());
            dto.setDiscount(od.getDiscount());
            dto.setToppings(od.getToppings());
            return dto;
        }).collect(Collectors.toList());
    }
}
