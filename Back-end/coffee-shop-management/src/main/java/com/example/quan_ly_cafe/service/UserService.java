package com.example.quan_ly_cafe.service;


import com.example.quan_ly_cafe.component.JwtTokenUtils;
import com.example.quan_ly_cafe.dto.EmployeeDTO;
import com.example.quan_ly_cafe.dto.EmployeeUpdateDTO;
import com.example.quan_ly_cafe.dto.UserDTO;
import com.example.quan_ly_cafe.model.Roles;
import com.example.quan_ly_cafe.model.Users;
import com.example.quan_ly_cafe.repo.IRoleRepo;
import com.example.quan_ly_cafe.repo.IUserRepository;
import com.example.quan_ly_cafe.respone.UserInforRespone;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    @Autowired
    private IUserRepository userRepo;
    @Autowired
    private IRoleRepo roleRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void updateUser(Users user) {
        userRepo.save(user); // Lưu người dùng sau khi cập nhật
    }
    /**
     * tao tai khoan
     * @param userDTO thong tin cua nguoi dung muon tao tai khoan
     */
    @Override
    public void createUser(UserDTO userDTO) {
        Users users = new Users();
        users.setFullName(userDTO.getFullName() != null ? userDTO.getFullName() : "");
        users.setAddress(userDTO.getAddress() != null ? userDTO.getAddress() : "");
        users.setEmail(userDTO.getEmail());
        users.setNumberphone(userDTO.getNumberphone());
        users.setUsername(userDTO.getUsername());
        users.setGender(userDTO.getGender());
        users.setImgUrl(userDTO.getImgUrl());

        Date birthday = (Date) userDTO.getBirthday();
        users.setIsActive(true);
        Roles roles = roleRepo.findByRoleId(userDTO.getRoleId());
        if (roles != null) {
            users.setRole(roles);
        }else  {
            throw new DataIntegrityViolationException("Role nay khong ton tai");
        }

        String password = passwordEncoder.encode(userDTO.getPassword());
        users.setPassword(password);

        userRepo.saves(users.getFullName(),
                users.getAddress(),
                users.getNumberphone(),
                users.getEmail(),
                users.getUsername(),
                users.getPassword(),
                birthday,
                users.getIsActive(),
                users.getRole().getRoleId(),
                users.getGender(), // Thêm gender vào query insert
                users.getImgUrl()); // Thêm imgUrl vào query insert
    }

    /**
     * dang nhap bang username va password sex tra ve 1 token
     * @param username  tai khoan nguoi dung
     * @param password  password nguoi dung
     * @return tra ve 1 token
     */
    @Override
    public String login(String username, String password) {
        Optional<Users> user = userRepo.findByUsername(username); // kiem tra tai khoan
        Users userExist = user.get();
        if (!user.isPresent()) {
            throw new DataIntegrityViolationException("Username already exists"); // kiem tra tai khoan
        }
        if (!passwordEncoder.matches(password, userExist.getPassword())) {
            throw new DataIntegrityViolationException("mat khau bi sai");// kiem tra mat khau
        }

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, password,userExist.getAuthorities());
        // tao token chua thong tin nguoi dung va mat khau xac thuc
        authenticationManager.authenticate(auth); // xac thuc nguoi dung neu dung la co trong database se tra ve
        // thanh cong neu khong se nem ra ngoai le

        return jwtTokenUtils.generateToken(userExist);
    }


    /**
     * kiem tra numberphone da ton tai hay chua
     * @param phoneNumber so dien thoai nguoi dung nhap vao
     * @return tra ve true neu tai khoan nay ton tai, nguoc lai la false
     */
    @Override
    public boolean exitsNumberphone(String phoneNumber) {
        return userRepo.existsByNumberphone(phoneNumber);

    }

    /**
     * kiem tra email da ton tai trong database  chua
     * @param email email cua nguoi dung nhap vao
     * @return tra ve true neu nhu eamil nay ton tai trong he thong, nguoc lai tra ve false
     */
    @Override
    public boolean exitsEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    /**
     * kiem tra tai khoan cua user da cap nhat lai sau 30 ngay chua
     * @param users thong tin doi tuong user muon cap nhat mat khau
     * @return true neu mat khau chua cap nhat sau 30 ngay, false neu tai khoan duoc cap nhat
     */
    @Override
    public boolean isPasswordExpired(Users users) {
        LocalDateTime lastUpdate = users.getUpdatedAt();
        if (lastUpdate == null) {
            return false; // maajt khau chua tung cap nhat
        }
        return ChronoUnit.DAYS.between(lastUpdate, LocalDateTime.now()) > 30;
    }

    /**
     * cap nhat lai mat khau moi cho tai khoan va trar ve 1 token moi
     * @param users thong tin doi tuong user muon cap nhat lai
     * @return token cho tai khoan moi
     */
    @Override
    public String updatePassword(Users users) {
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        users.setUpdatedAt(LocalDateTime.now());
        userRepo.save(users);
        return jwtTokenUtils.generateToken(users);
    }

    /**
     * tim kiem username ton tai trong h
     * @param username username nguoi dung nhap vao
     * @return doi tuong Users
     */
    @Override
    public Optional<Users> findByUsername(String username) {

        return userRepo.findByUsername(username);
    }

    /**
     * kiem tra username ton tai trong he thong
     * @param username username nguoi dung nhap vao
     * @return true neu ton tai false  neu khong ton tai
     */
    @Override
    public boolean exitsUsername(String username) {
        if (userRepo.existsByUsername(username)) {
            return true;
        }
        return false;
    }
    @Override
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    /**
     * chuyen doi tu 1 lop class sang lop class DTO de tranh gay mat mat du lieu
     * @param users ten tai khoan nguoi dung
     * @return tra ve 1 doi tuong dto
     */
    public UserDTO ConverDTO (Users users) {
        return modelMapper.map(users, UserDTO.class);
    }

    @Override
    public UserInforRespone converUser(Users users) {
        return modelMapper.map(users,UserInforRespone.class);
    }

    @Override
    public Users findByPhone(String phone) {
        return userRepo.findByNumberphone(phone).get();
    }

    // day la phan thay doi password
    @Override
    public void changePassword(Users Users) {
        userRepo.save(Users);
    }

    @Override
    public void updateUsersByImgUrlAndUserId(String imgUrlA, Integer userId) {
        userRepo.updateUsersByImgUrlAndUserId(imgUrlA, userId);
    }

    @Override
    public Optional<Users> findUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

//    @Override
//    public void changePassword(String oldPassword, String newPassword, Integer userId) {
//        userRepo.changePassword(newPassword, userId);
//    }

    @Override
    public Page<Users> findAll(Pageable pageable) {
        Page<Users> users = userRepo.findAllAdmin(pageable);
        return  userRepo.findAllAdmin(pageable);
    }

    @Override
    public Users findById(Integer id) {
        return userRepo.findById(id).orElse(null);
    }

    @Override
    public Users save(EmployeeDTO employeeDTO) {
        System.out.println("Dữ liệu nhận được từ frontend: " + employeeDTO);

        Users users=new Users();



        // Gán các thuộc tính từ EmployeeDTO sang Users
        users.setFullName(employeeDTO.getFullName() != null ? employeeDTO.getFullName() : "");
        users.setAddress(employeeDTO.getAddress() != null ? employeeDTO.getAddress() : "");
        users.setEmail(employeeDTO.getEmail());
        users.setNumberphone(employeeDTO.getNumberphone());
        users.setUsername(employeeDTO.getUsername());
        users.setIsActive(employeeDTO.getIsActive() != null ? employeeDTO.getIsActive() : true);
        users.setGender(employeeDTO.getGender());

        if (employeeDTO.getBirthday() != null) {
            users.setBirthday(employeeDTO.getBirthday());
        }
        // Set imgUrl (lưu ảnh)
        users.setImgUrl(employeeDTO.getImgUrl());

        users.setSalary(employeeDTO.getSalary() != null ? employeeDTO.getSalary() : 0.0);

        // Nếu roleId không được cung cấp, đặt mặc định là "ROLE_USER"
        Roles roles = null;
        if (employeeDTO.getRoleId() == null) {
            roles = roleRepo.findByRoleName("ROLE_USER");
            if (roles == null) {
                throw new RuntimeException("Role mặc định 'ROLE_USER' không tồn tại");
            }
        } else {
            roles = roleRepo.findById(employeeDTO.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại."));
        }

        users.setRole(roles);

        // Mã hóa mật khẩu nếu có password
        if (employeeDTO.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(employeeDTO.getPassword());
            users.setPassword(encodedPassword);
        }

        // Lưu user và trả về đối tượng đã lưu
        return userRepo.save(users);
    }

    @Override
    public Users update(EmployeeUpdateDTO employeeUpdateDTO, Integer id) {
        Users users = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User với id này không tồn tại"));


        // Gán các thuộc tính từ EmployeeDTO sang Users
        users.setFullName(employeeUpdateDTO.getFullName() != null ? employeeUpdateDTO.getFullName() : "");
        users.setAddress(employeeUpdateDTO.getAddress() != null ? employeeUpdateDTO.getAddress() : "");
        users.setEmail(employeeUpdateDTO.getEmail());
        users.setNumberphone(employeeUpdateDTO.getNumberphone());
        users.setUsername(employeeUpdateDTO.getUsername());
        users.setIsActive(employeeUpdateDTO.getIsActive() != null ? employeeUpdateDTO.getIsActive() : true);
        users.setGender(employeeUpdateDTO.getGender());

        if (employeeUpdateDTO.getBirthday() != null) {
            users.setBirthday(employeeUpdateDTO.getBirthday());
        }
        // Set imgUrl (lưu ảnh)
        users.setImgUrl(employeeUpdateDTO.getImgUrl());

        users.setSalary(employeeUpdateDTO.getSalary() != null ? employeeUpdateDTO.getSalary() : 0.0);

        // Nếu roleId không được cung cấp, đặt mặc định là "ROLE_USER"
        Roles roles = null;
        if (employeeUpdateDTO.getRoleId() == null) {
            roles = roleRepo.findByRoleName("ROLE_USER");
            if (roles == null) {
                throw new RuntimeException("Role mặc định 'ROLE_USER' không tồn tại");
            }
        } else {
            roles = roleRepo.findById(employeeUpdateDTO.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại."));
        }

        users.setRole(roles);

        // Mã hóa mật khẩu nếu có password
        if (employeeUpdateDTO.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(employeeUpdateDTO.getPassword());
            users.setPassword(encodedPassword);
        }

        // Lưu user và trả về đối tượng đã lưu
        return userRepo.save(users); }


    @Override
    public void delete(Integer id) {
        userRepo.deleteById(id);
    }

    @Override
    public Page<Users> searchUsers(String useName, String fullName, String numberPhone, Pageable pageable) {
        return userRepo.searchUsers(useName, fullName, numberPhone, pageable);
    }

    @Override
    public Page<Users> findUsersByRole(String role, Pageable pageable) {
        // Gọi đến repository để tìm kiếm người dùng có role là ROLE_USER
        return userRepo.findByRoleRoleName(role, pageable);
    }

    @Override
    public List<Users> getAllUsers() {
        return (List<Users>) userRepo.findAll();
    }

    @Override
    public Users getUserById(Integer userId) {
        return userRepo.findById(userId).orElse(null);
    }
}

