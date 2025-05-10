package com.example.demotrangoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    /**
     * gui ma code co 6 chu so den nguoi dung de xac thuc
     * @param toEmai dia chi email nguoi dung nhap
     * @return ma Code
     */
    public Integer sendSimpleMail(String toEmai) {
        try {
            String mail = toEmai + "";
            System.out.println(mail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("quanlycaphec010@gmail.com");
            message.setTo(mail);
            String getCode = String.valueOf(getNumberCode());

            message.setSubject("Your confirmation code is : "+getCode);
            message.setText("Cafe-management thank you");
            mailSender.send(message);
            return Integer.parseInt(getCode);
        } catch ( Exception e ) {
            return 0;
        }
    }

    /**
     * su dung thang random de tao
     * @return tao ra ma code
     */
    public int getNumberCode() {
        Random random = new Random();
        // Sinh ra số ngẫu nhiên từ 100000 đến 999999 (bao gồm)
        return 100000 + random.nextInt(900000);
    }
}
