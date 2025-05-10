package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
//    Optional<Users> findByUserName(String userName);
    Optional<Users> findById(Long userId);

}
