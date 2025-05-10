package com.example.demotrangoder.controller;

import com.example.demotrangoder.model.Product;
import com.example.demotrangoder.model.Table;
import com.example.demotrangoder.service.ITableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/table")
public class TableController {
    @Autowired
    private ITableService tableService;
    @GetMapping("")
    public ResponseEntity<List<Table>> findAllTable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Table> tables = tableService.findAll(pageable);

        return ResponseEntity.ok(tables.getContent());  // Trả về danh sách các Table trong nội dung trang
    }
    // Phương thức tìm kiếm theo tableCode
    @GetMapping("/searchByCode")
    public ResponseEntity<Page<Table>> searchByCode(
            @RequestParam(required = false) String tableCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Table> tables = tableService.searchByTableCode(tableCode, pageable);

        return ResponseEntity.ok(tables); // Trả về trang các bảng tìm được theo tableCode
    }
    @PostMapping("/create")
    public ResponseEntity<Table> createTable(@RequestBody Table table) {
        if (table.getTableCode() == null || table.getTableName() == null) {
            return ResponseEntity.badRequest().build();
        }
        Table newTable = tableService.save(table);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTable);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Table> updateTable(@PathVariable Long id, @RequestBody Table updatedTable) {
        Optional<Table> existingTable = tableService.findById(id);
        if (existingTable.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Table table = existingTable.get();
        table.setTableCode(updatedTable.getTableCode());
        table.setTableName(updatedTable.getTableName());

        Table savedTable = tableService.save(table);
        return ResponseEntity.ok(savedTable);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        Optional<Table> table = tableService.findById(id);
        if (table.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        tableService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @GetMapping("/hi")
    public ResponseEntity<?> hi(){
        return ResponseEntity.ok("hi");
    }
    @GetMapping("/{id}")
    public ResponseEntity<Table> getTableById(@PathVariable Long id) {
        Optional<Table> table = tableService.findById(id);
        if (table.isPresent()) {
            return ResponseEntity.ok(table.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // Cập nhật trạng thái bàn (đã thanh toán)
    @PutMapping("/{id}/status")
    public void updateTableStatus(@PathVariable("id") Long tableId, @RequestParam("status") boolean status) {
        tableService.updateStatus(tableId, status);
    }
}
