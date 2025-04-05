package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<Table,Long> {
    Page<Table> findByTableCodeContainingIgnoreCase(String tableCode, Pageable pageable);

}
