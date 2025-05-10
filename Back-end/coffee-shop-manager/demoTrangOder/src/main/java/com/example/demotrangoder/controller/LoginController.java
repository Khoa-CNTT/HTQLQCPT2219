package com.example.demotrangoder.controller;


import com.example.demotrangoder.dto.SendCodeDTO;
import com.example.demotrangoder.dto.UserDTO;
import com.example.demotrangoder.dto.UserLoginDTO;
import com.example.demotrangoder.model.SendCode;
import com.example.demotrangoder.model.Users;
import com.example.demotrangoder.respone.ChangePasswordRespone;
import com.example.demotrangoder.respone.FindUserByEmail;
import com.example.demotrangoder.respone.UserErrorsRespone;
import com.example.demotrangoder.respone.UserRespone;
import com.example.demotrangoder.service.EmailSenderService;
import com.example.demotrangoder.service.ISendCodeService;
import com.example.demotrangoder.service.IUserService;
import com.example.demotrangoder.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Cho phép yêu cầu từ localhost:3000
@RequestMapping("/api")
public class    LoginController {
    @Autowired
    private IUserService userService;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private ISendCodeService sendCodeService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private final TokenService tokenService;

    public LoginController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestBody UserDTO userDTO
    ) {
        Optional<Users> optionalUser = Optional.ofNullable(userService.findById(id));

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Người dùng không tồn tại với ID: " + id);
        }

        Users user = optionalUser.get();

        // Tạm thời tắt kiểm tra validation để tránh lỗi
        if (!user.getUsername().equals(userDTO.getUsername()) && userService.exitsUsername(userDTO.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Tên đăng nhập đã tồn tại trong hệ thống");
        }

        // Tương tự cho email và số điện thoại
        if (!user.getEmail().equals(userDTO.getEmail()) && userService.exitsEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email đã tồn tại trong hệ thống");
        }

        if (!user.getNumberphone().equals(userDTO.getNumberphone()) && userService.exitsNumberphone(userDTO.getNumberphone())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Số điện thoại đã tồn tại trong hệ thống");
        }

        // Cập nhật thông tin
        user.setFullName(userDTO.getFullName());
        user.setAddress(userDTO.getAddress());
        user.setBirthday(userDTO.getBirthday());
        user.setNumberphone(userDTO.getNumberphone());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setGender(userDTO.getGender());
        user.setIsActive(userDTO.getIsActive());
        user.setImgUrl(userDTO.getImgUrl());

        // Mã hóa mật khẩu mới trước khi lưu (nếu có mật khẩu mới được cung cấp)
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        }

        // Lưu lại người dùng
        userService.updateUser(user);

        return ResponseEntity.ok(userService.ConverDTO(user));
    }

    /**
     * Xử lý yêu cầu đăng nhập của người dùng.
     *
     * @param userLoginDTO Đối tượng chứa thông tin đăng nhập của người dùng, bao gồm tên tài khoản và mật khẩu.
     * @param bindingResult Chứa kết quả của quá trình validate và ràng buộc dữ liệu từ form đăng nhập.
     * @return Trả về ResponseEntity với các trạng thái sau:
     *         - BadRequest (400) nếu như mật khẩu đã hết hạn quá 30 ngày.
     *         - BadRequest (400) nếu dữ liệu đăng nhập không hợp lệ (validate thất bại).
     *         - NotFound (404) nếu không tìm thấy tên tài khoản trong hệ thống.
     *         - Ok (200) nếu đăng nhập thành công và trả về thông tin người dùng cùng token.
     *         - InternalServerError (500) nếu có lỗi xảy ra trong quá trình xử lý.
     */
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO userLoginDTO,
                                   BindingResult bindingResult) {
        System.out.println("Received Login Request: " + userLoginDTO);

        // Kiểm tra lỗi ràng buộc
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Optional<Users> optionalUser = userService.findByUsername(userLoginDTO.getUsername());
            if (!optionalUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay nguoi dung");
            }
            Users users = optionalUser.get();
            String token = userService.login(userLoginDTO.getUsername(), userLoginDTO.getPassword());
            if (userService.isPasswordExpired(users)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ChangePasswordRespone.builder()
                        .message("Mat khau ban da qua han 30 ngay can thay doi lai mat khau")
                        .oldPassword(users.getPassword())
                        .username(userLoginDTO.getUsername())
                        .build());
            }
            return ResponseEntity.ok().body(UserRespone.builder()
                    .token(token)
                    .message("Ban da dang nhap thanh cong")
                    .role(users.getRole())
                    .userDTO(userService.ConverDTO(users))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhoneNumber(@RequestParam String numberphone) {
        boolean exists = userService.exitsNumberphone(numberphone);
        if (exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Số điện thoại này đã tồn tại trong hệ thống"));
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "Số điện thoại có thể sử dụng"));
    }
    @GetMapping("/email/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.exitsEmail(email);
        if (exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "email này đã tồn tại trong hệ thống"));
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "email có thể sử dụng"));
    }
    /**
     * dùng để thay đổi password
     * @param username tên tài khoản của người dùng
     * @param passwordChange mật khẩu thay đổi
     * @return Ok (200) nếu thay đổi mật khẩu thành công
     */
    @PostMapping("/verify/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String token, // Token từ Header
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "passwordChange", required = false) String passwordChange
    ) {
        if (username == null || passwordChange == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tham số username hoặc passwordChange không được để trống");
        }
        Users users = userService.findByUsername(username).orElse(null);
        if (users == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không tìm thấy người dùng");
        }
        users.setPassword(passwordChange);
        String newtoken = userService.updatePassword(users);
        return ResponseEntity.ok(UserRespone.builder()
                .message("Đã cập nhật mật khẩu thành công")
                .userDTO(userService.ConverDTO(users))
                .token(token)
                .build());
    }



    /**
     *  dùng để tạo ra 1 tài khoản user
     * @param userDTO chứa thông tin của người của người dùng tạo tài khoản
     * @param bindingResult chứa kết quả của quá trình validate và ràng buộc dữ liệu
     * @param request là đối tượng HttpServletRequest được gửi từ đối tượng Client
     * @return  trả về (400) nếu quá trình validate xảy ra lỗi
     *          trả về (200) nếu như quá trình validate thành công và xử lý dữ liệu thành công trong database
     */
    @PostMapping("/user/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO,
                                        BindingResult bindingResult,
                                        HttpServletRequest request) {
        try {
            if(bindingResult.hasErrors()){
                List<UserErrorsRespone> errorsMessage = bindingResult.getFieldErrors()
                        .stream()
                        .map(fieldError -> {
                            UserErrorsRespone error = new UserErrorsRespone();
                            switch (fieldError.getField()) {
                                case "fullName":
                                    error.setFullName(fieldError.getDefaultMessage());
                                    break;
                                case "address":
                                    error.setAddress(fieldError.getDefaultMessage());
                                    break;
                                case "birthday":
                                    // Nếu bạn cần xử lý dạng ngày, bạn có thể tùy chỉnh ở đây
                                    error.setBirthday(null);
                                    break;
                                case "numberphone":
                                    error.setNumberphone(fieldError.getDefaultMessage());
                                    break;
                                case "username":
                                    error.setUsername(fieldError.getDefaultMessage());
                                    break;
                                case "password":
                                    error.setPassword(fieldError.getDefaultMessage());
                                    break;
                                case "gender":
                                    error.setGender(fieldError.getDefaultMessage());
                                case "imgUrl":
                                    error.setImgUrl(fieldError.getDefaultMessage());
                                case "email":
                                    error.setEmail(fieldError.getDefaultMessage());
                                    break;
                                default:
                                    // Có thể xử lý trường hợp không xác định
                                    break;
                            }
                            return error;
                        })
                        .toList();

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorsMessage);
            }


//            userService.createUser(userDTO);
            return ResponseEntity.ok().body(UserRespone.builder()
                    .userDTO(userDTO)
                    .message("Ban da tao thanh cong 1 user")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * luw
     * @param email email cua nguoi dung nhap vao de check
     * @return tra ve (500) neu xay ra trong qua trinh xu ly
     *         tra ve (404) neu khong tim thay thong tin nguoi dung
     *         tra ve (200) neu da luu vao trong database bang check-email
     */
//    @PostMapping("/email/check-email")
//    public ResponseEntity<?> checkEmail(@RequestParam("email") String email) {
//        if (!userService.exitsEmail(email)) {
//            Integer code = emailSenderService.sendSimpleMail(email);
//            if (code!=0) {
//                String checkCode = String.valueOf(code);
//                sendCodeService.save(new SendCodeDTO(checkCode,email));
//                return ResponseEntity.ok("da hoan thanh");
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body(Collections.singletonMap("errors",false));
//            }
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("nguoi dung  da ton tai trong he thong");
//
//    }


    /**
     *  gui ma code den email nguoi tao tai khoan
//     * @param userDTO chứa thông tin của người của người dùng tạo tài khoản
//     * @param bindingResult chứa kết quả của quá trình validate và ràng buộc dữ liệu
     * @return tra ve (400) neu qua trinh validate du lieu xay ra sai va qua trinh kiem tra du lieu
     *         tra ve (400) neu nhu tai khoan da ton tai
     *         tra ve (400) neu nhu numberphone da ton tai
     *         tra ve (400) neu nhu email da ton tai
     *         tra ve (500) nem ra ngoai le neu xay ra loi trong qua trinh xu ly du lieu
     *         tra ve (200) neu nhu qua trinh gui code qua email thanh cong
     */
    @PostMapping("/email/send-code-email")
    public ResponseEntity<?> sendCodeEmail(@RequestParam("email")  String email) {
        try {
            Integer code = emailSenderService.sendSimpleMail(email);
            if (code!=0) {
                String checkCode = String.valueOf(code);
                sendCodeService.save(new SendCodeDTO(checkCode,email));
                return ResponseEntity.ok("ddax hoan thanh");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("errors",false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error",false));
        }
    }

    /**
     *  dung de kiem tra ma code nguoi dung nhap vao
     * @param code ma code nguoi dung nhap vao sau khi nhan ma code duojc gui tu he thong den mail nguoi dung
     * @param email đây là email người dùng dùng để đăng kí tài khoản
     * @return tra ve (400) neu ma code khong ton tai
     *         tra ve (500) nem ra 1 ngoai le neu nhu xay ra troong qua trinh xu ly du lieu
     *         tra ve (200) nếu như dữ liệu trong bảng SendCode này xóa đi
     */
    @PostMapping("/email/check-code")
    public ResponseEntity<?> checkCode(@RequestParam("code") String code,
                                       @RequestParam("email") String email) {
        try {
            // Tìm session dựa trên email
            SendCode sendCode = sendCodeService.findByEmail(email);


            // Kiểm tra nếu mã code không tồn tại
            if (sendCode == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã code không tồn tại");
            }

            // So sánh mã code và xóa session nếu khớp
            if (sendCode.getCheckCode().equals(code)) {
                sendCodeService.delete(sendCode);
                return ResponseEntity.ok("da hoan thanh");
            }

            // Trả về trạng thái OK nếu mọi thứ đều thành công
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã code không tồn tại");

        } catch (Exception e) {
            // Xử lý ngoại lệ và trả về lỗi nội bộ server
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình kiểm tra mã code");
        }
    }
    @GetMapping("/user/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String email) {
        if (userService.exitsEmail(email)) {
            Integer code = emailSenderService.sendSimpleMail(email);
            if (code!=0) {
                String checkCode = String.valueOf(code);
                sendCodeService.save(new SendCodeDTO(checkCode,email));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khong tim thay email");
    }

    @PostMapping("/storage/hello/{id}")
    public ResponseEntity<?> hello(@Valid @RequestParam("id") Integer id) {
        int a = 10;
        return ResponseEntity.status(HttpStatus.OK).body("hello");
    }


    @PostMapping("/saveUser")
    public ResponseEntity<?> save (@Valid @RequestBody UserDTO userDTO) {
        userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.OK).body("da hoan thanh");
    }


    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal Users user) {
        if (user != null) {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("khoong vao dc");
    }

    @GetMapping("/verify/change-password")
    public ResponseEntity<?> changPassword(@AuthenticationPrincipal Users user,
                                           @RequestParam("oldPassword") String oldPassword,
                                           @RequestParam("newPassword") String newPassword) {
        int flag;
        if (user == null) {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }
        if (bCryptPasswordEncoder.matches(user.getPassword(), oldPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("mat khau cu khong chinh xac");
        }
        if (oldPassword.equals(newPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Maajt khau bi trung");
        }
        if (!bCryptPasswordEncoder.matches(user.getPassword(), newPassword)) {
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            userService.changePassword(user);
            return ResponseEntity.status(HttpStatus.OK).body("da thay doi thanh cong" );
        }

        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body("mat khau da bi trung");
    }

    @GetMapping("/find-user-by-email")
    public ResponseEntity<?> findUserByEmail(@RequestParam("email") String email) {
        Optional<Users> users = userService.findUserByEmail(email);

        if (users.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(
                    FindUserByEmail.builder().fullName(users.get().getFullName()).username(users.get().getUsername()).email(users.get().getEmail()).build());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khoong tim thay nguoi dung");
    }


    @GetMapping("/change-password")
    public ResponseEntity<?> changPassword (@RequestParam("newPassword") String newPassword,
                                            @RequestParam("username") String username,
                                            @RequestParam("email") String email) {
        if (newPassword==null || username == null) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Optional<Users> users = userService.findUserByEmail(email);
        if (users.isPresent()) {
            String password = bCryptPasswordEncoder.encode(newPassword);
            users.get().setPassword(password);
            userService.changePassword(users.get());
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Khoong tim thay nguoi");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String token) {
        // Bỏ tiền tố "Bearer " từ token nếu cần thiết
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // Gọi phương thức invalidateToken để vô hiệu hóa token
        tokenService.invalidateToken(token);
        return ResponseEntity.ok("Đã đăng xuất thành công");
    }
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        if (exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }
        // Trả về JSON khi username chưa tồn tại
        return ResponseEntity.ok(Map.of("message", "Tên đăng nhập có thể sử dụng"));    }
}
