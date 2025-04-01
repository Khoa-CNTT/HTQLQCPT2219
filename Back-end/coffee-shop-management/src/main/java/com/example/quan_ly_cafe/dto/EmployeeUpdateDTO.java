package com.example.quan_ly_cafe.dto;


import com.example.quan_ly_cafe.Validation.SalaryMultiple;
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
public class EmployeeUpdateDTO {
    private String imgUrl;

    @NotBlank(message = "Không được để trống tên")
    private String fullName;

    @NotBlank(message = "Không được để trống địa chỉ")
    private String address;

    @DateTimeFormat(pattern = "yyyy/MM/dd")
    private Date birthday;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Số điện thoại không đúng định dạng")
    private String numberphone;

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 6, message = "Tên đăng nhập phải lớn hơn 6 ký tự")
    @Pattern(regexp = "^[^\\d].*", message = "Tên đăng nhập không được bắt đầu bằng số.")
//    @UniqueUsernameUpdate // Sử dụng annotation mới cho chức năng update
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email không hợp lệ")
    @Size(max = 50, message = "Không được quá 50 ký tự")
    private String email;

    private Boolean gender;

    @SalaryMultiple
    private Double salary;

    private Boolean isActive;

    private Integer roleId;

    @Override
    public String toString() {
        return "EmployeeUpdateDTO{" +
                "imgUrl='" + imgUrl + '\'' +
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
