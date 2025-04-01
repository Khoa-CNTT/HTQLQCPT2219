package com.example.quan_ly_cafe.repo;


import com.example.quan_ly_cafe.model.Roles;
import com.example.quan_ly_cafe.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.Optional;

public interface IUserRepository extends JpaRepository<Users, Integer> {
    boolean existsByUsername(String username); // hafm kiem tra tai khoan co ton tai hay khong
    boolean existsByEmail(String email);
    boolean existsByNumberphone(String numberphone);


    @Query(value = "SELECT * FROM users WHERE user_name = :username", nativeQuery = true)
    Optional<Users> findByUsername(@Param("username") String username);

    @Transactional
    @Query(value = "SELECT u FROM Users u WHERE u.role.roleId = 1")
    Page<Users> findAllAdmin(Pageable pageable);

    Page<Users> findAllByRole(Roles role, Pageable pageable);
    Optional<Users> findByNumberphone(String numberphone);
    Optional<Users> findByEmail(String email);
    @Modifying
    @Transactional
    @Query(value = "insert into users (full_name, address, numberphone, email, user_name, `password`, birthday, is_active, role_id, gender, img_url) " +
            "values (:fullName, :address, :numberphone, :email, :username, :password, :birthday, :isActive, :roleId, :gender, :imgUrl)",
            nativeQuery = true)
    void saves(@Param("fullName") String fullName,
               @Param("address") String address,
               @Param("numberphone") String numberphone,
               @Param("email") String email,
               @Param("username") String username,
               @Param("password") String password,
               @Param("birthday") Date birthday,
               @Param("isActive") boolean isActive,
               @Param("roleId") int roleId,
               @Param("gender") boolean gender, // Thêm tham số gender
               @Param("imgUrl") String imgUrl); // Thêm tham số imgUrl



    @Query("SELECT u FROM Users u WHERE " +
            "(:userName IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :userName, '%'))) AND " +
            "(:fullName IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
            "(:numberPhone IS NULL OR u.numberphone LIKE CONCAT('%', :numberPhone, '%'))")
    Page<Users> searchUsers(
            @Param("userName") String userName,
            @Param("fullName") String fullName,
            @Param("numberPhone") String numberPhone,
            Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Users u SET u.imgUrl = :param WHERE u.userId = :userId")
    void updateUsersByImgUrlAndUserId(@Param("param") String param, @Param("userId") Integer userId);

//    @Modifying
//    @Transactional
//    @Query("UPDATE Users u SET u.password = :param WHERE u.userId = :userId")
//    void changePassword(@Param("param") String param, @Param("userId") Integer userId);


}