package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.CallOderRequest;
import com.example.quan_ly_cafe.model.OderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OderDetailRepository extends JpaRepository<OderDetail,Long> {
    // Tìm OderDetails theo CallOderRequest
//    List<OderDetail> findByCallOderRequest(CallOderRequest callOderRequest);
    List<OderDetail> findByCallOderRequest_Table_TableId(Long tableId);
    // Tìm OderDetail của một CallOderRequest với status là false
    List<OderDetail> findByCallOderRequestAndStatusFalse(CallOderRequest callOderRequest);

}
