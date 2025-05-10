package com.example.demotrangoder.repo;

import com.example.demotrangoder.model.SendCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ISendCodeRepo extends JpaRepository<SendCode, Long> {
    @Query(value = "SELECT s.checkCode FROM send_code as s WHERE s.email = :email",nativeQuery = true)
    String findByEmailCode(@Param("email") String email);
    SendCode findByEmail(String email);
    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "delete from send_code as s where s.email = :email", nativeQuery = true)
    void delete(@Param("email") String sendCode);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO send_code (check_code, email) VALUES (:checkCode, :email)", nativeQuery = true)
    void saveSendCode(String checkCode, String email);

}
