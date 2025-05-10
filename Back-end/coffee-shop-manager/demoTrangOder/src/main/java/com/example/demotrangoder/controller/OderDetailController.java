package com.example.demotrangoder.controller;

import com.example.demotrangoder.dto.OderDetailDTO1;
import com.example.demotrangoder.model.OderDetail;
import com.example.demotrangoder.service.ITableService;
import com.example.demotrangoder.service.OderDetailService;
import com.example.demotrangoder.service.OderDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oder-details")
@CrossOrigin(origins = "*")
public class OderDetailController {
    @Autowired
    private OderDetailService oderDetailService;

    @Autowired
    private OderDetailServiceImpl oderDetailServiceImpl;
    private ITableService tableService;
    @Autowired
    public OderDetailController(OderDetailService oderDetailService) {
        this.oderDetailService = oderDetailService;
    }

    @GetMapping("/table/{tableId}")
    public List<OderDetail> getOrderDetailsByTableId(@PathVariable Long tableId) {
        return oderDetailService.getOrderDetailsByTableId(tableId);
    }
    @GetMapping("")
    public ResponseEntity<List<OderDetail>> getAllOderDetails() {
        List<OderDetail> oderDetails = oderDetailServiceImpl.getAllOrderDetails();
        return ResponseEntity.ok(oderDetails);
    }
    @GetMapping("/call-order/{callOrderId}")
    public ResponseEntity<List<OderDetailDTO1>> getOderDetailsByCallOrder(@PathVariable Long callOrderId) {
        List<OderDetailDTO1> list = oderDetailServiceImpl.getDetailsByCallOrderRequestId(callOrderId);
        return ResponseEntity.ok(list);
    }
}
