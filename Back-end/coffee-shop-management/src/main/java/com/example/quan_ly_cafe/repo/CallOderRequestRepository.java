package com.example.quan_ly_cafe.repo;

import com.example.quan_ly_cafe.model.CallOderRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CallOderRequestRepository extends JpaRepository<CallOderRequest,Long> {
    List<CallOderRequest> findByTableTableId(Long tableId);
    // Đếm tổng số hóa đơn (theo id)
    @Query("SELECT COUNT(DISTINCT o.callOderRequest.id) " +
            "FROM OderDetail o " +
            "WHERE SUBSTRING(o.shippingDay, 1, 10) = :today")
    Long countTodayOrders(@Param("today") String today);
    @Query("SELECT COUNT(DISTINCT o.callOderRequest.id) " +
            "FROM OderDetail o " +
            "WHERE SUBSTRING(o.shippingDay, 1, 7) = :month")
    Long countMonthlyOrders(@Param("month") String month);


}
