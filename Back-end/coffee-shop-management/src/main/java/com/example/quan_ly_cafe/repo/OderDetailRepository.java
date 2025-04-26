package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.CallOderRequest;
import com.example.quan_ly_cafe.model.OderDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OderDetailRepository extends JpaRepository<OderDetail,Long> {
    // Tìm OderDetails theo CallOderRequest
//    List<OderDetail> findByCallOderRequest(CallOderRequest callOderRequest);
    List<OderDetail> findByCallOderRequest_Table_TableId(Long tableId);
    // Tìm OderDetail của một CallOderRequest với status là false
    List<OderDetail> findByCallOderRequestAndStatusFalse(CallOderRequest callOderRequest);
    List<OderDetail> findByCallOderRequestId(Long callOderRequestId);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM oder_detail_topping WHERE topping_id = :toppingId", nativeQuery = true)
    void deleteToppingReferences(@Param("toppingId") Long toppingId);

}
