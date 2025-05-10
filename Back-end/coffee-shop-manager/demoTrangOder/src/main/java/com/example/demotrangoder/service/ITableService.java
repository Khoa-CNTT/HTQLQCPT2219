package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ITableService {
    Page<Table> findAll(Pageable pageable);
    Optional<Table> findById(Long id);
    void updateStatus(Long tableId, Boolean status); // Thêm phương thức này
    Page<Table> searchByTableCode(String tableCode, Pageable pageable);
    Table save(Table table);
    void deleteById(Long id);

}
