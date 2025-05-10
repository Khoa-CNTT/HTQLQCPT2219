package com.example.demotrangoder.controller;

import com.example.demotrangoder.dto.EmployeeDTO;
import com.example.demotrangoder.dto.EmployeeUpdateDTO;
import com.example.demotrangoder.model.Users;
import com.example.demotrangoder.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")  // Thêm CORS cho frontend chạy trên port 3000

public class UserController {
    @Autowired
    private IUserService userService;
    /**
     * Hiển thị tất cả User
     */
    @GetMapping("/pagination")
    public ResponseEntity<Page<Users>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
// Gọi service để lấy danh sách người dùng có role là "ROLE_USER"
//        Page<Users> users = userService.findUsersByRole("ROLE_USER", pageable);
        Page<Users> users=userService.findAll(pageable);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    /**
     * tìm kiếm user dựa vào userName,fullName, numberPhone có phân trang
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Users>> searchUsers(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String numberPhone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Users> users = userService.searchUsers(userName, fullName, numberPhone, pageable);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    /**
     * Thêm mới 1 user
     */
    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO, BindingResult bindingResult) {
        System.out.println("Received salary: " + employeeDTO.getSalary());

        // Kiểm tra xem có lỗi validation hay không
        if (bindingResult.hasErrors()) {
            // Trả về danh sách các thông báo lỗi gọn gàng
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage()) // Lấy thông báo lỗi từ mỗi fieldError
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errorMessages);
        }

        // Nếu không có lỗi, tiếp tục thêm mới
        Users createdUser = userService.save(employeeDTO); // id là null cho tạo mới
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
    /**
     * Update 1 user
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Integer id, @Valid @RequestBody EmployeeUpdateDTO employeeUpdateDTO, BindingResult bindingResult) {
        // Kiểm tra xem có lỗi validation hay không
        if (bindingResult.hasErrors()) {
            // Trả về danh sách các thông báo lỗi gọn gàng
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(fieldError -> fieldError.getDefaultMessage()) // Lấy thông báo lỗi từ mỗi fieldError
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errorMessages);
        }

        // Nếu không có lỗi, tiếp tục cập nhật
        Users updatedUser = userService.update(employeeUpdateDTO, id); // Sử dụng phương thức save cho cập nhật
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    /**
     * lấy thông tin dựa trên id
     */
    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable("id") Integer id) {
        Users user = userService.findById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    /**
     * xóa 1 user dựa trên id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
