package com.example.demotrangoder.service;


import com.example.demotrangoder.dto.EmployeeDTO;
import com.example.demotrangoder.dto.EmployeeUpdateDTO;
import com.example.demotrangoder.dto.UserDTO;
import com.example.demotrangoder.model.Users;
import com.example.demotrangoder.respone.UserInforRespone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    void createUser(UserDTO userDTO);
    String login (String username, String password);
    boolean exitsUsername(String username);
    boolean existsByUsername(String username);
    boolean exitsNumberphone(String numberphone);
    boolean exitsEmail(String email);
    boolean isPasswordExpired(Users Users);
    String updatePassword(Users Users);
    Optional<Users> findByUsername(String username);

    UserDTO ConverDTO(Users Users);
    UserInforRespone converUser(Users Users);
    Users findByPhone(String phone);
    void changePassword(Users Users);
    void updateUsersByImgUrlAndUserId(String imgUrlA, Integer userId);
    //    void changePassword (String oldPassword, String newPassword,Integer userId);
    Optional<Users> findUserByEmail(String email);
    void updateUser(Users user);
    // hau
    Page<Users> findAll(Pageable pageable);
    Users findById(Integer id);
    Users save(EmployeeDTO employeeDTO); // Phương thức duy nhất để thêm mới
    Users update(EmployeeUpdateDTO employeeUpdateDTO, Integer id);
    void delete(Integer id);
    Page<Users> searchUsers(String useName, String fullName, String numberPhone, Pageable pageable);
    Page<Users> findUsersByRole(String role, Pageable pageable);

    // duong
    public List<Users> getAllUsers();

    public Users getUserById(Integer userId);
}