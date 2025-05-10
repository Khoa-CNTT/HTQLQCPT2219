package com.example.demotrangoder.service;

import com.example.demotrangoder.model.Table;
import com.example.demotrangoder.repo.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TableServiceImpl implements ITableService{
    @Autowired
    private TableRepository tableRepository;
    @Override
    public Page<Table> findAll(Pageable pageable) {
        return tableRepository.findAll(pageable);
    }
    @Override
    public Optional<Table> findById(Long id) { // Thêm phương thức này
        return tableRepository.findById(id);
    }
    @Override
    public void updateStatus(Long tableId, Boolean status) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setStatus(status);
        tableRepository.save(table);
    }
    @Override
    public Page<Table> searchByTableCode(String tableCode, Pageable pageable) {
        if (tableCode != null && !tableCode.isEmpty()) {
            return tableRepository.findByTableCodeContainingIgnoreCase(tableCode, pageable);
        }
        return tableRepository.findAll(pageable);  // Nếu không có tableCode thì trả về tất cả
    }
    @Override
    public Table save(Table table) {
        return tableRepository.save(table);
    }

    @Override
    public void deleteById(Long id) {
        tableRepository.deleteById(id);
    }

}
