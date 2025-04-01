package com.example.quan_ly_cafe.Validation;


import com.example.quan_ly_cafe.model.Users;
import com.example.quan_ly_cafe.repo.IUserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class UniqueUsernameUpdateValidator implements ConstraintValidator<UniqueUsernameUpdate, String> {

    @Autowired
    private IUserRepository userRepository;

    private Long currentUserId; // ID của người dùng hiện tại

    public void setCurrentUserId(Long userId) {
        this.currentUserId = userId;
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        // Loại trừ "admin" và "root"
        if (username.equalsIgnoreCase("admin") || username.equalsIgnoreCase("root")) {
            return false;
        }

        // Kiểm tra xem có currentUserId không
        if (currentUserId == null) {
            // Không có currentUserId có nghĩa là đây là thao tác thêm mới
            return !userRepository.existsByUsername(username); // Kiểm tra username có tồn tại hay không
        }

        // Nếu có currentUserId, kiểm tra xem username có trùng với username của người dùng hiện tại hay không
        Optional<Users> existingUserOpt = userRepository.findByUsername(username);
        return existingUserOpt.isEmpty() || existingUserOpt.get().getUserId().equals(currentUserId);
    }
}
