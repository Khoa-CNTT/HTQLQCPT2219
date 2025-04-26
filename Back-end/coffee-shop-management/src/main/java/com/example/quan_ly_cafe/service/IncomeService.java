package com.example.quan_ly_cafe.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class IncomeService {

    @PersistenceContext
    private EntityManager entityManager;
    public Map<String, Object> getIncomeAndHourlyIncomeByDate(LocalDate date) {
        Map<String, Object> result = new HashMap<>();

        // Tổng thu nhập trong ngày
        String totalQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o " +
                "WHERE o.status = TRUE AND SUBSTRING(o.shippingDay, 1, 10) = :date";
        Query totalQ = entityManager.createQuery(totalQuery);
        totalQ.setParameter("date", date.toString());
        Double totalIncome = (Double) totalQ.getSingleResult();
        result.put("totalIncome", totalIncome != null ? totalIncome : 0.0);

        // Khởi tạo map với 24 giờ ban đầu
        Map<Integer, Double> hourlyIncomeMap = new LinkedHashMap<>();
        for (int i = 0; i < 24; i++) {
            hourlyIncomeMap.put(i, 0.0);
        }

        // Truy vấn thu nhập theo giờ
        String hourlyQuery = "SELECT SUBSTRING(o.shippingDay, 12, 2), SUM(o.totalMoneyOder) " +
                "FROM OderDetail o WHERE o.status = TRUE AND SUBSTRING(o.shippingDay, 1, 10) = :date " +
                "GROUP BY SUBSTRING(o.shippingDay, 12, 2) ORDER BY SUBSTRING(o.shippingDay, 12, 2)";
        Query hourlyQ = entityManager.createQuery(hourlyQuery);
        hourlyQ.setParameter("date", date.toString());

        List<Object[]> hourlyResult = hourlyQ.getResultList();
        for (Object[] row : hourlyResult) {
            Integer hour = Integer.parseInt((String) row[0]); // 00 đến 23
            Double money = (Double) row[1];
            hourlyIncomeMap.put(hour, money);
        }

        result.put("hourlyIncome", hourlyIncomeMap);
        return result;
    }



    // Tính tổng thu nhập theo tuần và thu nhập theo từng ngày
    public Map<String, Object> getIncomeByWeekWithDaily(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new HashMap<>();

        // Tổng thu nhập trong tuần
        String totalQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o " +
                "WHERE o.status = TRUE AND o.shippingDay BETWEEN :startDate AND :endDate";
        Query totalQ = entityManager.createQuery(totalQuery);
        totalQ.setParameter("startDate", startDate.toString());
        totalQ.setParameter("endDate", endDate.toString());
        Double totalIncome = (Double) totalQ.getSingleResult();
        result.put("totalIncome", totalIncome != null ? totalIncome : 0.0);

        // Thu nhập theo từng ngày trong tuần
        Map<String, Double> dailyIncomeMap = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = startDate.plusDays(i);
            String dailyQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o " +
                    "WHERE o.status = TRUE AND SUBSTRING(o.shippingDay, 1, 10) = :date";
            Query dailyQ = entityManager.createQuery(dailyQuery);
            dailyQ.setParameter("date", currentDay.toString());
            Double dailyIncome = (Double) dailyQ.getSingleResult();
            dailyIncomeMap.put(currentDay.getDayOfWeek().toString(), dailyIncome != null ? dailyIncome : 0.0);
        }
        result.put("dailyIncome", dailyIncomeMap);

        return result;
    }


    public Map<String, Object> getIncomeByMonthWithDaily(LocalDate start, LocalDate end) {
        Map<String, Object> result = new HashMap<>();

        // ✅ Format lại ngày sang kiểu String yyyy-MM-dd vì shippingDay là String trong DB
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String startStr = start.format(formatter);
        String endStr = end.format(formatter);

        // ✅ 1. Tổng thu nhập toàn tháng
        String totalQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o " +
                "WHERE o.status = TRUE AND o.shippingDay BETWEEN :start AND :end";
        Query tq = entityManager.createQuery(totalQuery);
        tq.setParameter("start", startStr);
        tq.setParameter("end", endStr);
        Double totalIncome = (Double) tq.getSingleResult();
        result.put("totalIncome", totalIncome != null ? totalIncome : 0.0);

        // ✅ 2. Thu nhập theo từng ngày
        String dailyQuery = "SELECT o.shippingDay, SUM(o.totalMoneyOder) " +
                "FROM OderDetail o " +
                "WHERE o.status = TRUE AND o.shippingDay BETWEEN :start AND :end " +
                "GROUP BY o.shippingDay";
        Query dq = entityManager.createQuery(dailyQuery);
        dq.setParameter("start", startStr);
        dq.setParameter("end", endStr);

        List<Object[]> dailyResults = dq.getResultList();
        Map<String, Double> dailyIncome = new TreeMap<>();

        // ✅ Khởi tạo tất cả các ngày trong khoảng với giá trị 0
        LocalDate date = start;
        while (!date.isAfter(end)) {
            dailyIncome.put(date.format(formatter), 0.0);
            date = date.plusDays(1);
        }

        // ✅ Gán lại giá trị có thật từ DB, cộng dồn thu nhập cho mỗi ngày
        for (Object[] row : dailyResults) {
            String day = row[0].toString().substring(0, 10);  // Lấy ngày mà không lấy thời gian (yyyy-MM-dd)
            Double income = (Double) row[1];

            // Cộng dồn thu nhập cho ngày đã có
            dailyIncome.put(day, dailyIncome.getOrDefault(day, 0.0) + income);
        }

        result.put("dailyIncome", dailyIncome);
        return result;
    }

    public Map<String, Object> getIncomeByYear(LocalDate yearStart, LocalDate yearEnd) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Chuyển LocalDate sang String để so sánh trong JPQL
        String startStr = yearStart.format(formatter);
        String endStr = yearEnd.format(formatter);

        // Tổng thu nhập cả năm
        String totalQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o WHERE o.status = TRUE AND o.shippingDay BETWEEN :yearStart AND :yearEnd";
        Query totalQ = entityManager.createQuery(totalQuery);
        totalQ.setParameter("yearStart", startStr);
        totalQ.setParameter("yearEnd", endStr);
        Double totalIncome = (Double) totalQ.getSingleResult();
        totalIncome = totalIncome != null ? totalIncome : 0.0;

        // Thu nhập theo từng tháng
        Map<Integer, Double> monthlyIncome = new LinkedHashMap<>();
        for (int month = 1; month <= 12; month++) {
            LocalDate start = yearStart.withMonth(month).withDayOfMonth(1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

            String startMonthStr = start.format(formatter);
            String endMonthStr = end.format(formatter);

            String monthlyQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o WHERE o.status = TRUE AND o.shippingDay BETWEEN :start AND :end";
            Query mq = entityManager.createQuery(monthlyQuery);
            mq.setParameter("start", startMonthStr);
            mq.setParameter("end", endMonthStr);
            Double income = (Double) mq.getSingleResult();
            monthlyIncome.put(month, income != null ? income : 0.0);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("monthlyIncome", monthlyIncome);
        return result;
    }


    public Map<String, Object> getIncomeByCustomRange(LocalDate fromDate, LocalDate toDate) {
        // Định dạng ngày yyyy-MM-dd
        String fromDateStr = fromDate.toString();
        String toDateStr = toDate.toString();

        // Tổng thu nhập
        String totalQuery = "SELECT SUM(o.totalMoneyOder) FROM OderDetail o " +
                "WHERE o.status = TRUE AND SUBSTRING(o.shippingDay, 1, 10) >= :fromDate AND SUBSTRING(o.shippingDay, 1, 10) <= :toDate";
        Query tq = entityManager.createQuery(totalQuery);
        tq.setParameter("fromDate", fromDateStr);
        tq.setParameter("toDate", toDateStr);

        Double totalIncome = (Double) tq.getSingleResult();
        if (totalIncome == null) totalIncome = 0.0;

        // Truy vấn thu nhập theo từng ngày
        String groupQuery = "SELECT SUBSTRING(o.shippingDay, 1, 10), SUM(o.totalMoneyOder) " +
                "FROM OderDetail o WHERE o.status = TRUE AND SUBSTRING(o.shippingDay, 1, 10) >= :fromDate AND SUBSTRING(o.shippingDay, 1, 10) <= :toDate " +
                "GROUP BY SUBSTRING(o.shippingDay, 1, 10) ORDER BY SUBSTRING(o.shippingDay, 1, 10)";
        Query gq = entityManager.createQuery(groupQuery);
        gq.setParameter("fromDate", fromDateStr);
        gq.setParameter("toDate", toDateStr);

        // Map chứa dữ liệu thực tế từ DB
        Map<String, Double> incomeFromDb = new HashMap<>();
        List<Object[]> resultList = gq.getResultList();
        for (Object[] row : resultList) {
            String dateOnly = (String) row[0];
            Double income = (Double) row[1];
            incomeFromDb.put(dateOnly, income);
        }

        // Tạo danh sách các ngày từ fromDate đến toDate và gán dữ liệu từ incomeFromDb (nếu có), nếu không thì là 0.0
        Map<String, Double> dailyIncome = new LinkedHashMap<>();
        LocalDate current = fromDate;
        while (!current.isAfter(toDate)) {
            String dateStr = current.toString(); // yyyy-MM-dd
            dailyIncome.put(dateStr, incomeFromDb.getOrDefault(dateStr, 0.0));
            current = current.plusDays(1);
        }

        // Tạo response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("dailyIncome", dailyIncome);
        return response;
    }





}

