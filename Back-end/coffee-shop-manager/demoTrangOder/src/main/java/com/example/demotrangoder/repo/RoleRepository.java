package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Roles, Long> {
    Optional<Roles> findByRoleName(String roleName);
    Optional<Roles> findById(Long id); // Đây là phương thức mặc định của JpaRepository

}
