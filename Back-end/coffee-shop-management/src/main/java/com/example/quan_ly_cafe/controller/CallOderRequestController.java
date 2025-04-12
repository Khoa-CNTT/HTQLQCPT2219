package com.example.quan_ly_cafe.controller;

import com.example.quan_ly_cafe.dto.CallOderRequestDTO;
import com.example.quan_ly_cafe.dto.OrderRequestDTO;
import com.example.quan_ly_cafe.dto.ProductDTO;
import com.example.quan_ly_cafe.model.*;
import com.example.quan_ly_cafe.repo.*;
import com.example.quan_ly_cafe.service.CallOderRequestServiceImpl;
import com.example.quan_ly_cafe.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("api/orders")
@CrossOrigin(origins = "*")
public class CallOderRequestController {
@Autowired
private IngredientRepository ingredientRepository;
    @Autowired
    private CallOderRequestRepository callOderRequestRepository;
@Autowired
private ProductIngredientRepository productIngredientRepository;
    @Autowired
    private OderDetailRepository orderDetailRepository;
    @Autowired
    private SizeRepository  sizeRepository;
    @Autowired
    private DiscountService discountService;
    @Autowired
    private CallOderRequestServiceImpl callOderRequestService;
    @Autowired
    private TableRepository tableRepository; // Autowired cho TableRepository
    @Autowired
    private ToppingIngredientRepository toppingIngredientRepository;
    @GetMapping("/count-today")
    public ResponseEntity<Long> countTodayOrders() {
        return ResponseEntity.ok(callOderRequestService.countTodayOrders());
    }
    @GetMapping("/count-month")
    public ResponseEntity<Long> countMonthlyOrders() {
        return ResponseEntity.ok(callOderRequestService.countMonthlyOrders());
    }

    @GetMapping("/all")
    public ResponseEntity<List<CallOderRequestDTO>> getAll() {
        return ResponseEntity.ok(callOderRequestService.getAllCallOderRequestDTO());
    }
    @GetMapping("/find/{id}")
    public ResponseEntity<CallOderRequestDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(callOderRequestService.getCallOderRequestById(id));
    }
    @GetMapping("/search")
    public ResponseEntity<Page<CallOderRequestDTO>> searchById(
            @RequestParam(required = false) Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<CallOderRequestDTO> result = callOderRequestService.searchByIdWithPagination(id, page, size);
        return ResponseEntity.ok(result);
    }


    // API để lấy danh sách món đã order của một bàn
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/table/{tableId}")
    public List<OderDetail> getOrderDetailsByTable(@PathVariable Long tableId, Authentication authentication) {
// Lấy tên người dùng từ principal
        String username = (authentication != null && authentication.getPrincipal() instanceof UserDetails)
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : "Anonymous";

        System.out.println("Authenticated user: " + username);
        // Lấy tất cả các CallOderRequest của bàn tương ứng
        List<CallOderRequest> orders = callOderRequestRepository.findByTableTableId(tableId);

        List<OderDetail> orderDetails = new ArrayList<>();
        // Duyệt qua các đơn hàng để lấy OderDetail của từng đơn, chỉ lấy những đơn có status = false
        for (CallOderRequest order : orders) {
            // Lọc các OderDetail có status = false (chưa thanh toán)
            List<OderDetail> pendingOrderDetails = orderDetailRepository.findByCallOderRequestAndStatusFalse(order);
            orderDetails.addAll(pendingOrderDetails);
        }

        return orderDetails;
    }
    // xử lý việc cập nhật trạng thái status của một OderDetail.
    @PutMapping("/{oderDetailId}/status")
    public OderDetail updateOrderDetailStatus(@PathVariable Long oderDetailId) {
        OderDetail orderDetail = orderDetailRepository.findById(oderDetailId)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with ID: " + oderDetailId));

        // Set status = true (đã thanh toán)
        orderDetail.setStatus(true);

        // Lưu lại thay đổi
        return orderDetailRepository.save(orderDetail);
    }



    @PostMapping("/place")
    public CallOderRequest placeOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        System.out.println("Order Request: " + orderRequestDTO);

        // Kiểm tra mã khuyến mãi
        Discount discount = null;
        if (orderRequestDTO.getCode() != null && !orderRequestDTO.getCode().isEmpty()) {
            discount = discountService.findByCode(orderRequestDTO.getCode());
            if (discount == null || !discount.getStatus()) {
                throw new RuntimeException("Mã giảm giá không hợp lệ hoặc không còn hiệu lực.");
            }
        }

        // Tạo CallOderRequest mới
        CallOderRequest callOderRequest = new CallOderRequest();
        long id = (long) (Math.random() * 1_000_000_0000L); // Tạo số ngẫu nhiên 10 chữ số
        callOderRequest.setId(id);
        callOderRequest.setUser(orderRequestDTO.getUser());
        callOderRequest.setPaymentStatus(orderRequestDTO.getPaymentStatus());
        callOderRequest.setTable(orderRequestDTO.getTable());
        callOderRequest.setTotalPrice(orderRequestDTO.getTotalPrice());
        callOderRequest = callOderRequestRepository.save(callOderRequest);

        for (ProductDTO productDTO : orderRequestDTO.getProducts()) {
            System.out.println("Product: " + productDTO);

            if (productDTO.getProductId() == null) {
                throw new RuntimeException("Product ID cannot be null for product: " + productDTO.getProductName());
            }

            if (productDTO.getSizeId() == null) {
                throw new RuntimeException("Size ID cannot be null for product: " + productDTO.getProductName());
            }

            OderDetail oderDetail = new OderDetail();
            oderDetail.setProduct(new Product(productDTO.getProductId()));
            oderDetail.setQuantity(productDTO.getQuantity());
            oderDetail.setShippingDay(productDTO.getShippingDay());
            oderDetail.setNoteProduct(productDTO.getNoteProduct());

            Size size = sizeRepository.findById(productDTO.getSizeId())
                    .orElseThrow(() -> new RuntimeException("Size not found with ID: " + productDTO.getSizeId()));

            double totalMoneyOder;
            if (productDTO.getQuantity() == 1) {
                totalMoneyOder = (productDTO.getPrice() + size.getPrice()) * productDTO.getQuantity();
            } else {
                totalMoneyOder = productDTO.getPrice() + (size.getPrice() * productDTO.getQuantity());
            }

            if (productDTO.getToppings() != null) {
                for (Topping topping : productDTO.getToppings()) {
                    totalMoneyOder += (topping.getPrice() * productDTO.getQuantity());

                    // ✅ Trừ nguyên liệu cho topping
                    List<ToppingIngredient> toppingIngredients = toppingIngredientRepository.findByToppingIdIn(Collections.singletonList(topping.getId()));
                    for (ToppingIngredient toppingIngredient : toppingIngredients) {
                        Ingredient ingredient = toppingIngredient.getIngredient();
                        double amountRequired = toppingIngredient.getAmountRequired(); // Lượng nguyên liệu cần cho topping

                        double currentStock = ingredient.getQuantityInStock(); // Lấy tồn kho hiện tại của nguyên liệu

                        double totalRequired = amountRequired * productDTO.getQuantity(); // Tính tổng số nguyên liệu cần cho topping

                        if (currentStock < totalRequired) {
                            throw new RuntimeException("Không đủ nguyên liệu cho topping: " + topping.getName());
                        }

                        // Trừ nguyên liệu từ kho
                        ingredient.setQuantityInStock(currentStock - totalRequired);
                        ingredientRepository.save(ingredient);
                    }
                }
            }

            if (discount != null) {
                double discountValue = totalMoneyOder * (discount.getValue() / 100.0);
                totalMoneyOder -= discountValue;
                oderDetail.setDiscount(discount);
                System.out.println("Applied Discount: " + discount + ", Discount Value: " + discountValue);
            }

            oderDetail.setTotalMoneyOder(totalMoneyOder);
            oderDetail.setStatus(false);
            oderDetail.setSize(size);
            oderDetail.setCallOderRequest(callOderRequest);
            oderDetail.setToppings(productDTO.getToppings());
            System.out.println("Saving OderDetail: " + oderDetail);

            oderDetail = orderDetailRepository.save(oderDetail);
            System.out.println("Saved OderDetail ID: " + oderDetail);

            // ✅ Trừ nguyên liệu từ kho theo product và số lượng
            List<ProductIngredient> productIngredients = productIngredientRepository.findByProductProductId(productDTO.getProductId());

            for (ProductIngredient productIngredient : productIngredients) {
                Ingredient ingredient = productIngredient.getIngredient();
                double amountRequired = productIngredient.getAmountRequired(); // ✅ dùng đúng theo class bạn định nghĩa

                double currentStock = ingredient.getQuantityInStock(); // ✅ lấy tồn kho hiện tại

                double totalRequired = amountRequired * productDTO.getQuantity(); // số lượng cần

                if (currentStock < totalRequired) {
                    throw new RuntimeException("Không đủ nguyên liệu cho sản phẩm: " + productDTO.getProductName());
                }

                // Trừ nguyên liệu
                ingredient.setQuantityInStock(currentStock - totalRequired); // ✅ cập nhật tồn kho
                ingredientRepository.save(ingredient);
            }

        }

        return ResponseEntity.ok(callOderRequest).getBody();
    }

    @GetMapping("/hi")
    public ResponseEntity<?> hi(){
        return ResponseEntity.ok("hi");
    }


}
