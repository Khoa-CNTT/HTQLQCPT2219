package com.example.demotrangoder.service;

import com.example.demotrangoder.dto.*;
import com.example.demotrangoder.model.CallOderRequest;
import com.example.demotrangoder.repo.CallOderRequestRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CallOderRequestServiceImpl implements CallOderRequestService {
    @Autowired
    private CallOderRequestRepository callOderRequestRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Page<CallOderRequestDTO> searchByIdWithPagination(Long id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CallOderRequest> resultPage;

        if (id != null) {
            Optional<CallOderRequest> optional = callOderRequestRepository.findById(id);
            List<CallOderRequest> list = optional.map(List::of).orElse(Collections.emptyList());
            return new PageImpl<>(list.stream().map(this::convertToDto).collect(Collectors.toList()), pageable, list.size());
        } else {
            resultPage = callOderRequestRepository.findAll(pageable);
            return resultPage.map(this::convertToDto);
        }
    }

    @Override
    public Long countMonthlyOrders() {
        String thisMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return callOderRequestRepository.countMonthlyOrders(thisMonth);
    }
    @Override
    public Long countTodayOrders() {
        // Format ngày hiện tại về dạng chuỗi yyyy-MM-dd để so sánh
        String todayStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return callOderRequestRepository.countTodayOrders(todayStr);
    }


    private CallOderRequestDTO convertToDto(CallOderRequest request) {
        // Reuse your DTO conversion code here
        CallOderRequestDTO dto = new CallOderRequestDTO();
        dto.setId(request.getId());
        dto.setTotalPrice(request.getTotalPrice());
        dto.setPaymentStatus(request.getPaymentStatus());

        if (request.getTable() != null) {
            TableDTO tableDTO = new TableDTO();
            tableDTO.setTableId(request.getTable().getTableId());
            tableDTO.setTableCode(request.getTable().getTableCode());
            tableDTO.setTableName(request.getTable().getTableName());
            dto.setTable(tableDTO);
        }

        if (request.getFeedback() != null) {
            FeedbackDTO feedbackDTO = new FeedbackDTO();
            feedbackDTO.setId(request.getFeedback().getId());
            feedbackDTO.setContent(request.getFeedback().getContent());
            feedbackDTO.setRating(request.getFeedback().getRating());
            feedbackDTO.setDate(request.getFeedback().getDate().toString());
            dto.setFeedback(feedbackDTO);
        }

        List<OderDetailDTO> detailDTOs = request.getOderDetails().stream().map(detail -> {
            OderDetailDTO detailDTO = new OderDetailDTO();
            detailDTO.setOderDetailId(detail.getOderDetailId());
            detailDTO.setQuantity(detail.getQuantity());
            detailDTO.setShippingDay(detail.getShippingDay().toString());
            detailDTO.setStatus(detail.getStatus());
            detailDTO.setTotalMoneyOder(detail.getTotalMoneyOder());
            detailDTO.setNoteProduct(detail.getNoteProduct());

            if (detail.getProduct() != null) {
                Product1DTO product1DTO = new Product1DTO();
                product1DTO.setProductId(detail.getProduct().getProductId());
                product1DTO.setProductName(detail.getProduct().getProductName());
                detailDTO.setProduct(product1DTO);
            }

            if (detail.getDiscount() != null) {
                DiscountDTO discountDTO = new DiscountDTO();
                discountDTO.setId(detail.getDiscount().getId());
                discountDTO.setCode(detail.getDiscount().getCode());
                discountDTO.setValue(detail.getDiscount().getValue());
                detailDTO.setDiscount(discountDTO);
            }

            return detailDTO;
        }).collect(Collectors.toList());

        dto.setOderDetails(detailDTOs);
        return dto;
    }

    @Override
    public List<CallOderRequestDTO> getAllCallOderRequestDTO() {
        return callOderRequestRepository.findAll().stream().map(request -> {
            CallOderRequestDTO dto = new CallOderRequestDTO();
            dto.setId(request.getId());
            dto.setTotalPrice(request.getTotalPrice());
            dto.setPaymentStatus(request.getPaymentStatus());

            // Table
            if (request.getTable() != null) {
                TableDTO tableDTO = new TableDTO();
                tableDTO.setTableId(request.getTable().getTableId());
                tableDTO.setTableCode(request.getTable().getTableCode());
                tableDTO.setTableName(request.getTable().getTableName());
                dto.setTable(tableDTO);
            }

            // Feedback
            if (request.getFeedback() != null) {
                FeedbackDTO feedbackDTO = new FeedbackDTO();
                feedbackDTO.setId(request.getFeedback().getId());
                feedbackDTO.setContent(request.getFeedback().getContent());
                feedbackDTO.setRating(request.getFeedback().getRating());
                feedbackDTO.setDate(request.getFeedback().getDate().toString());
                dto.setFeedback(feedbackDTO);
            }

            // OderDetails
            List<OderDetailDTO> detailDTOs = request.getOderDetails().stream().map(detail -> {
                OderDetailDTO detailDTO = new OderDetailDTO();
                detailDTO.setOderDetailId(detail.getOderDetailId());
                detailDTO.setQuantity(detail.getQuantity());
                detailDTO.setShippingDay(detail.getShippingDay().toString());
                detailDTO.setStatus(detail.getStatus());
                detailDTO.setTotalMoneyOder(detail.getTotalMoneyOder());
                detailDTO.setNoteProduct(detail.getNoteProduct());

                // Product
                if (detail.getProduct() != null) {
                    Product1DTO product1DTO = new Product1DTO();
                    product1DTO.setProductId(detail.getProduct().getProductId());
                    product1DTO.setProductName(detail.getProduct().getProductName());
                    detailDTO.setProduct(product1DTO);
                }
                // Discount ➕ mới thêm vào
                if (detail.getDiscount() != null) {
                    DiscountDTO discountDTO = new DiscountDTO();
                    discountDTO.setId(detail.getDiscount().getId());
                    discountDTO.setCode(detail.getDiscount().getCode());
                    discountDTO.setValue(detail.getDiscount().getValue());
                    detailDTO.setDiscount(discountDTO);
                }
                // Size ➕ mới thêm vào
                if (detail.getSize() != null) {
                    SizeDTO sizeDTO = new SizeDTO();
                    sizeDTO.setSizeId(detail.getSize().getSizeId());
                    sizeDTO.setSizeName(detail.getSize().getSizeName());
                    sizeDTO.setPrice(detail.getSize().getPrice()); // nếu có thuộc tính price
                    detailDTO.setSize(sizeDTO);
                }
                // Toppings ➕
                if (detail.getToppings() != null && !detail.getToppings().isEmpty()) {
                    List<ToppingDTO> toppingDTOs = detail.getToppings().stream().map(topping -> {
                        ToppingDTO toppingDTO = new ToppingDTO();
                        toppingDTO.setId(topping.getId());
                        toppingDTO.setName(topping.getName());
                        toppingDTO.setPrice(topping.getPrice());
                        return toppingDTO;
                    }).collect(Collectors.toList());
                    detailDTO.setToppings(toppingDTOs);
                }

                return detailDTO;
            }).collect(Collectors.toList());
            dto.setOderDetails(detailDTOs);

            return dto;
        }).collect(Collectors.toList());
    }
    @Override
    public CallOderRequestDTO getCallOderRequestById(Long id) {
        CallOderRequest request = callOderRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn gọi món với ID: " + id));

        CallOderRequestDTO dto = new CallOderRequestDTO();
        dto.setId(request.getId());
        dto.setTotalPrice(request.getTotalPrice());
        dto.setPaymentStatus(request.getPaymentStatus());

        // Table
        if (request.getTable() != null) {
            TableDTO tableDTO = new TableDTO();
            tableDTO.setTableId(request.getTable().getTableId());
            tableDTO.setTableCode(request.getTable().getTableCode());
            tableDTO.setTableName(request.getTable().getTableName());
            dto.setTable(tableDTO);
        }

        // Feedback
        if (request.getFeedback() != null) {
            FeedbackDTO feedbackDTO = new FeedbackDTO();
            feedbackDTO.setId(request.getFeedback().getId());
            feedbackDTO.setContent(request.getFeedback().getContent());
            feedbackDTO.setRating(request.getFeedback().getRating());
            feedbackDTO.setDate(request.getFeedback().getDate().toString());
            dto.setFeedback(feedbackDTO);
        }


        // OderDetails
        List<OderDetailDTO> detailDTOs = request.getOderDetails().stream().map(detail -> {
            OderDetailDTO detailDTO = new OderDetailDTO();
            detailDTO.setOderDetailId(detail.getOderDetailId());
            detailDTO.setQuantity(detail.getQuantity());
            detailDTO.setShippingDay(detail.getShippingDay().toString());
            detailDTO.setStatus(detail.getStatus());
            detailDTO.setTotalMoneyOder(detail.getTotalMoneyOder());
            detailDTO.setNoteProduct(detail.getNoteProduct());

            if (detail.getProduct() != null) {
                Product1DTO product1DTO = new Product1DTO();
                product1DTO.setProductId(detail.getProduct().getProductId());
                product1DTO.setProductName(detail.getProduct().getProductName());
                detailDTO.setProduct(product1DTO);
            }

            if (detail.getDiscount() != null) {
                DiscountDTO discountDTO = new DiscountDTO();
                discountDTO.setId(detail.getDiscount().getId());
                discountDTO.setCode(detail.getDiscount().getCode());
                discountDTO.setValue(detail.getDiscount().getValue());
                detailDTO.setDiscount(discountDTO);
            }

            return detailDTO;
        }).collect(Collectors.toList());
        dto.setOderDetails(detailDTOs);

        return dto;
    }

}