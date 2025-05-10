package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TableRepository extends JpaRepository<Table,Long> {
    Page<Table> findByTableCodeContainingIgnoreCase(String tableCode, Pageable pageable);

}
