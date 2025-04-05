import React, { useState } from "react";
import { storage } from "../../config/firebaseConfig"; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import styles from "../sign/sign.module.css";
import coffeeBg from "../../img/anh-cafe_2.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {  faEnvelope, faPhone, faUserCircle, faBirthdayCake, faTransgender, faImage, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import CSS mặc định của Tippy
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkPhoneNumber } from "../../service/UserService";
import * as value from "prettier"; // Đường dẫn tùy theo cấu trúc thư mục

const Register = () => {
    const navigate = useNavigate(); // ✅ Gọi useNavigate đúng cách
    const [errors, setErrors] = useState({});

    // Xử lý validate form
    const validateForm = async () => {
        let newErrors = {};

        // Validate họ và tên
        if (!user.fullName.trim()) {
            newErrors.fullName = "Không được để trống họ và tên";
        } else if (user.fullName.length > 50) {
            newErrors.fullName = "Họ và tên không được vượt quá 50 ký tự";
        }
        if (!user.address.trim()) newErrors.address = "Không được để trống địa chỉ";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!user.email.trim()) {
            newErrors.email = "Không được để trống email";
        } else if (user.email.length > 50) {
            newErrors.email = "Email không được vượt quá 50 ký tự";
        } else if (!emailRegex.test(user.email)) {
            newErrors.email = "Email không hợp lệ";
        }else {
            try {
                // 🛠 Gọi API để kiểm tra số điện thoại tồn tại
                await axios.get(`http://localhost:8081/api/email/check-email?email=${user.email}`);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    newErrors.email = error.response.data.message; // "Số điện thoại này đã tồn tại trong hệ thống"
                } else {
                    console.error("❌ Lỗi kiểm tra email:", error);
                }
            }
        }
        // Validate số điện thoại
        const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
        if (!user.numberphone.trim()) {
            newErrors.numberphone = "Không được để trống số điện thoại";
        } else if (!phoneRegex.test(user.numberphone)) {
            newErrors.numberphone = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và có 10 chữ số)";
        } else {
            try {
                // 🛠 Gọi API để kiểm tra số điện thoại tồn tại
                await axios.get(`http://localhost:8081/api/check-phone?numberphone=${user.numberphone}`);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    newErrors.numberphone = error.response.data.message; // "Số điện thoại này đã tồn tại trong hệ thống"
                } else {
                    console.error("❌ Lỗi kiểm tra số điện thoại:", error);
                }
            }
        }

// Validate username
        if (!user.username.trim()) {
            newErrors.username = "Không được để trống tên đăng nhập";
        } else if (user.username.length < 6) {
            newErrors.username = "Tên đăng nhập phải có ít nhất 6 ký tự";
        }else {
            try {
                // 🛠 Gọi API để kiểm tra số điện thoại tồn tại
                await axios.get(`http://localhost:8081/api/check-username?username=${user.username}`);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    newErrors.username = error.response.data.message; // "Số điện thoại này đã tồn tại trong hệ thống"
                } else {
                    console.error("❌ Lỗi kiểm tra số điện thoại:", error);
                }
            }
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!user.password.trim()) {
            newErrors.password = "Không được để trống mật khẩu";
        } else if (user.password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        } else if (!passwordRegex.test(user.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
        }
        if (!user.birthday) newErrors.birthday = "Không được để trống ngày sinh";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const [user, setUser] = useState({
        fullName: "",
        address: "",
        email: "",
        numberphone: "",
        username: "",
        password: "",
        gender: "Male",
        birthday: "",
        roleId: 1, // Giả sử roleId của người dùng mặc định là 2
        imgUrl: "",
    });

    const [image, setImage] = useState(null);

    // Xử lý thay đổi input
    const handleChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        const { name, value } = e.target;

        // 🛠 Xóa lỗi khi nhập lại
        setErrors((prev) => ({ ...prev, [name]: "" }));

        // 🛠 Kiểm tra số điện thoại ngay khi nhập
        if (name === "numberphone" && value.trim()) {
            const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
            if (!phoneRegex.test(value)) {
                setErrors((prev) => ({ ...prev, numberphone: "Số điện thoại không hợp lệ" }));
                return;
            }

            try {
                await axios.get(`http://localhost:8081/api/check-phone?numberphone=${value}`);
                setErrors((prev) => ({ ...prev, numberphone: "" })); // ✅ Xóa lỗi nếu số hợp lệ
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrors((prev) => ({ ...prev, numberphone: error.response.data.message }));
                } else {
                    console.error("❌ Lỗi khi kiểm tra số điện thoại:", error);
                }
            }
        }
        if (name === "username" && value.trim()) {
            if (value.length < 6) {
                setErrors((prev) => ({ ...prev, username: "Tên đăng nhập phải có ít nhất 6 ký tự" }));
                return;
            }

            try {
                await axios.get(`http://localhost:8081/api/check-username?username=${value}`);
                setErrors((prev) => ({ ...prev, username: "" })); // ✅ Xóa lỗi nếu username hợp lệ
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrors((prev) => ({ ...prev, username: error.response.data.message }));
                } else {
                    console.error("❌ Lỗi kiểm tra username:", error);
                }
            }
        }

    };



    // Xử lý chọn ảnh
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Xử lý đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🛠 Chờ validate xong mới tiếp tục đăng ký
        const isValid = await validateForm();
        if (!isValid) return; // ⛔ Nếu có lỗi thì không gửi dữ liệu

        try {
            let imageUrl = "";

            // 🛠 Upload ảnh nếu có
            if (image) {
                const storageRef = ref(storage, `images/${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Chuyển đổi giới tính
            const genderBoolean = user.gender === "Male";

            // Tạo object user mới để gửi lên backend
            const newUser = {
                ...user,
                imgUrl: imageUrl,
                gender: genderBoolean
            };

            // 🛠 Gửi API đăng ký
            const response = await axios.post("http://localhost:8081/api/saveUser", newUser);

            if (response.status === 200 || response.status === 201) {
                toast.success("🎉 Đăng ký thành công!", { position: "top-right", autoClose: 3000 });
                setTimeout(() => window.location.reload(), 5000);
            } else {
                toast.error("❌ Đăng ký thất bại! Hãy thử lại.", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            toast.error("❌ Đăng ký thất bại!", { position: "top-right", autoClose: 3000 });
        }
    };



    return (
        <div>
            <div className={styles.loginContainer}>
                {/* Phần bên trái chứa background */}
                <div className={styles.leftPanel} style={{backgroundImage: `url(${coffeeBg})`}}>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.loginBox}>
                        <div className={styles.loginHeader}>
                            {/*<FontAwesomeIcon icon={faKey} className={styles.icon}/>*/}
                            <h2 className={styles.headerText}>Đăng Ký</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faUser} className={styles.inputIcon}/>
                                    <Tippy
                                        content={errors.fullName || ""}
                                        visible={!!errors.fullName}
                                        className={styles.customTooltip}
                                    >
                                        <input
                                            className={`formControl ${errors.fullName ? "error" : ""}`}
                                            type="text"
                                            name="fullName"
                                            placeholder="Họ và tên"
                                            onChange={handleChange}
                                            title={errors.fullName || ""}
                                        />
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon}/>
                                    <Tippy content={errors.address || ""} visible={!!errors.address}
                                           className={styles.customTooltip}>
                                        <input
                                            className={`formControl ${errors.email ? "address" : ""}`}
                                            type="text"
                                            name="address"
                                            placeholder="Địa chỉ"
                                            onChange={handleChange}
                                            title={errors.address || ""}
                                        />
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon}/>
                                    <Tippy content={errors.email || ""} visible={!!errors.email}
                                           className={styles.customTooltip}>
                                        <input
                                            className={`formControl ${errors.email ? "error" : ""}`}
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            title={errors.email || ""}
                                        />
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faPhone} className={styles.inputIcon}/>
                                    <Tippy content={errors.numberphone || ""} visible={!!errors.numberphone}
                                           className={styles.customTooltip}>
                                        <input
                                            className={`formControl ${errors.numberphone ? "error" : ""}`}
                                            type="text"
                                            name="numberphone"
                                            placeholder="Số điện thoại"
                                            onChange={handleChange}
                                            onBlur={validateForm} // Kiểm tra số điện thoại khi rời khỏi input
                                            title={errors.numberphone || ""}
                                        />
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faUserCircle} className={styles.inputIcon}/>
                                    <Tippy content={errors.username || ""} visible={!!errors.username}
                                           className={styles.customTooltip}>
                                        <input
                                            className={`formControl ${errors.username ? "error" : ""}`}
                                            type="text"
                                            name="username"
                                            placeholder="Tên đăng nhập"
                                            onChange={handleChange}
                                            title={errors.username || ""}
                                        />
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faLock} className={styles.inputIcon}/>
                                    <Tippy content={errors.password || ""} visible={!!errors.password} className={styles.customTooltip}>
                                    <input
                                        className={styles.formControl}
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu"
                                        onChange={handleChange}/>
                                    </Tippy>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faBirthdayCake} className={styles.inputIcon}/>
                                    <input className={styles.formControl} type="date" name="birthday"
                                           onChange={handleChange}/>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faTransgender} className={styles.inputIcon}/>
                                    <select className={styles.selectControl} name="gender" onChange={handleChange}>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWithIcon}>
                                    <FontAwesomeIcon icon={faImage} className={styles.inputIcon}/>
                                    <input className={styles.fileInput} type="file" accept="image/*"
                                           onChange={handleImageChange}/>
                                </div>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button className={styles.loginButton} onClick={() => navigate("/login")}>
                                    Đăng nhập
                                </button>
                                <button className={styles.submitButton} type="submit">Đăng Ký</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
