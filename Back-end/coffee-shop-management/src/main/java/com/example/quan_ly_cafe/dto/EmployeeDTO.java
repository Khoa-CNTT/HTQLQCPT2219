package com.example.quan_ly_cafe.dto;


import com.example.quan_ly_cafe.Validation.EmailExists;
import com.example.quan_ly_cafe.Validation.NumberphoneExists;
import com.example.quan_ly_cafe.Validation.UniqueUsername;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private String imgUrl;
    @NotBlank(message = "Khonng duoc de trong ten")
    private String fullName;
    @NotBlank(message = "Khonng duoc de trong dia chi")
    private String address;

    @DateTimeFormat(pattern = "yyyy/MM/dd")
    private Date birthday;

    @NotBlank(message = "so dien thoai khong duoc de trong ")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "So dien thoai khong dung dinh dang ")
    @NumberphoneExists
    private String numberphone;

    @NotBlank(message = "Khong duoc de trong")
    @Size(min = 6, message = "Tên đăng nhập phải lớn hơn 6 ký tự")
    @Pattern(regexp = "^[^\\d].*", message = "Tên đăng nhập không được bắt đầu bằng số.") // Không bắt đầu bằng số
    @UniqueUsername
    private String username;

    @NotBlank(message = "Khong duoc de trong password")
    @Size(min = 8, message = "Mat khau phai co it nhat 8 ky tu")
    private String password;

    @NotBlank(message = "Khong duoc de trong email")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Email không hợp lệ")
    @Size(max = 50,message = "khong duoc qua 50 ki tu")
    @EmailExists
    private String email;
    private Boolean gender;
//    @SalaryMultiple
    private Double salary;

    private Boolean isActive;

    private Integer roleId;
    @Override
    public String toString() {
        return "EmployeeDTO{" +
                "url='" + imgUrl + '\'' +
                ", fullName='" + fullName + '\'' +
                ", address='" + address + '\'' +
                ", birthday=" + birthday +
                ", numberphone='" + numberphone + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", gender=" + gender +
                ", salary=" + salary +
                ", isActive=" + isActive +
                ", roleId=" + roleId +
                '}';
    }

}
