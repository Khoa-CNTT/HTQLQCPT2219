package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
//    Optional<Users> findByUserName(String userName);
    Optional<Users> findById(Long userId);

}
