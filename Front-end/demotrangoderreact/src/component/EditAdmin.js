import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUser, updateUser1 } from '../service/UserService';
import uploadImageToFirebase from '../config/uploadImageToFirebase';
import styles from "../Css/EditProfile.module.css";
import {FaBirthdayCake, FaCameraRetro, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaUser} from "react-icons/fa";
import data from "bootstrap/js/src/dom/data";
import {toast} from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const EditAdmin = () => {
    const [user, setUser] = useState({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState(""); // Thêm state cho ngày sinh
    const [numberphone, setNumberphone] = useState('');
    const [password, setPassword] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState(true); // Giới tính mặc định là nam (true: Nam, false: Nữ)
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState(""); // Lưu lỗi email
    const [phoneError, setPhoneError] = useState(""); // Lưu lỗi số điện thoại
    const [currentEmail, setCurrentEmail] = useState(""); // Lưu email ban đầu của user
    const [currentNumberPhone, setCurrentNumberPhone] = useState(""); // Lưu sđt ban đầu của user

    const handleGoBack = () => {
        navigate('/dashboard'); // Quay về trang /user
    };

    const handleGoToChangePassword = () => {
        navigate('/changePasss'); // Chuyển đến trang changePassword
    };
    // Lấy thông tin người dùng từ backend khi trang được tải
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await GetUser(); // Gọi API lấy thông tin người dùng
                console.log("Dữ liệu trả về từ API:", userData);

                if (userData) {
                    setUser(userData);
                    setFullName(userData.fullName);
                    setEmail(userData.email);
                    setCurrentEmail(userData.email); // ✅ Lưu email hiện tại để so sánh khi validate
                    setNumberphone(userData.numberphone);
                    setCurrentNumberPhone(userData.numberphone);
                    setAddress(userData.address);
                    setUsername(userData.username);
                    setImgUrl(userData.imgUrl);
                    setGender(userData.gender); // Giữ nguyên giá trị boolean true/false

                    // Chuyển đổi timestamp của birthday sang định dạng yyyy-MM-dd
                    if (userData.birthday) {
                        const birthDate = new Date(userData.birthday);
                        const formattedDate = birthDate.toISOString().split('T')[0]; // yyyy-MM-dd
                        setBirthday(formattedDate); // Gán giá trị ngày sinh
                    }
                } else {
                    console.log("No user data fetched");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API GetUser:", error);
            }
        };

        fetchUser();
    }, []);
    const checkEmailExists = async (email) => {
        try {
            // ✅ Nếu email không thay đổi, bỏ qua kiểm tra trùng lặp
            if (email === currentEmail) {
                setEmailError("");
                return true;
            }

            await axios.get(`http://localhost:8081/api/email/check-email?email=${email}`);
            setEmailError(""); // Không lỗi thì xóa lỗi
            return true;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setEmailError(error.response.data.message); // Hiển thị lỗi từ backend
            } else {
                toast.error("Không thể kiểm tra email, thử lại sau!");
            }
            return false;
        }
    };
    const [fullNameError, setFullNameError] = useState("");
    const [addressError, setAddressError] = useState("");
    const validateFullName = () => {
        if (!fullName.trim()) {
            setFullNameError("Không được để trống tên!");
            return false;
        }
        setFullNameError("");
        return true;
    };
    const validateAddress = () => {
        if (!address.trim()) {
            setAddressError("Không được để trống địa chỉ!");
            return false;
        }
        setAddressError("");
        return true;
    };


    // ✅ Validate Email (Kiểm tra rỗng, đúng định dạng, không quá 50 ký tự)
    const validateEmail = async () => {
        if (!email.trim()) {
            setEmailError("Không được để trống email!");
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setEmailError("Email không hợp lệ!");
            return false;
        }
        if (email.length > 50) {
            setEmailError("Email không được quá 50 ký tự!");
            return false;
        }
        setEmailError(""); // Xóa lỗi trước khi kiểm tra email trùng

        // ✅ Gọi API kiểm tra email trùng
        return await checkEmailExists(email);
    };

    const checkNumberPhoneExists = async (numberphone) => {
        try {
            // ✅ Nếu email không thay đổi, bỏ qua kiểm tra trùng lặp
            if (numberphone === currentNumberPhone) {
                setPhoneError("");
                return true;
            }

            await axios.get(`http://localhost:8081/api/check-phone?numberphone=${numberphone}`);
            setPhoneError(""); // Không lỗi thì xóa lỗi
            return true;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setPhoneError(error.response.data.message); // Hiển thị lỗi từ backend
            } else {
                toast.error("Không thể kiểm tra sđt, thử lại sau!");
            }
            return false;
        }
    };
    // ✅ Validate Số điện thoại
    const validatePhone =async () => {
        if (!numberphone.trim()) {
            setPhoneError("Không được để trống số điện thoại!");
            return false;
        }
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Số điện thoại Việt Nam
        if (!phoneRegex.test(numberphone)) {
            setPhoneError("Số điện thoại không hợp lệ!");
            return false;
        }
        setPhoneError(""); // Nếu hợp lệ, xóa lỗi
        return await checkNumberPhoneExists(numberphone);

    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        const isEmailValid = await validateEmail(); // 👈 thêm await ở đây
        const isPhoneValid = validatePhone();

        if (!isEmailValid || !isPhoneValid) {
            return; // Nếu có lỗi, dừng submit
        }
        // Kiểm tra nếu người dùng có chọn ảnh mới
        let imageUrl = imgUrl;
        if (imgUrl instanceof File) {
            try {
                imageUrl = await uploadImageToFirebase(imgUrl); // Upload ảnh lên Firebase
                console.log("Image URL from Firebase:", imageUrl);
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Có lỗi khi tải ảnh lên!");  // Toast lỗi
                return;
            }
        }

        // Kiểm tra URL cuối cùng trước khi gửi
        if (!imageUrl) {
            toast.error("URL ảnh bị rỗng, vui lòng thử lại!");  // Toast lỗi
            return;
        }

        // Tạo đối tượng userDTO với dữ liệu cập nhật
        const userDTO = {
            id: user.userId,
            fullName,
            email,
            numberphone,
            imgUrl: imageUrl,
            address,
            gender,  // Giữ giá trị gender là true/false
            username,
            birthday, // Gửi giá trị ngày sinh đã chỉnh sửa
        };

        console.log("userDTO:", userDTO);

        // Gọi API cập nhật thông tin người dùng
        const result = await updateUser1(userDTO);

        if (result) {
            toast.success("Cập nhật thông tin thành công!");  // Toast thành công
        } else {
            toast.error("Đã có lỗi khi cập nhật thông tin!");  // Toast lỗi
        }
    };


    return (
        <div className={styles.editChinh}>
            <h1 className={styles.tiltel1}>Chỉnh sửa thông tin người dùng</h1>
            <div className={styles.container1}>
                <div className={styles.profileImageContainer}>
                    {imgUrl instanceof File ? (
                        // Hiển thị ảnh xem trước nếu file mới được chọn
                        <img
                            src={URL.createObjectURL(imgUrl)} // URL tạm thời để hiển thị ảnh mới
                            alt="Profile Preview"
                            className={styles.profileImage}
                        />
                    ) : (
                        // Nếu không phải file (ví dụ ảnh từ backend)
                        <div className={styles.profileImage}>
                            <img
                                src={imgUrl} // Dữ liệu URL ảnh từ server hoặc đã có sẵn
                                alt="Profile"
                                className={styles.profileImage}
                            />
                        </div>
                    )}
                    <label className={styles.uploadButton}>
                        <FaCameraRetro className={styles.uploadIcon}/>
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImgUrl(file); // Lưu file vào state
                                }
                            }}
                            className={styles.fileInput}
                        />
                    </label>
                </div>
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.columnWrapper}>
                            <div className={styles.leftColumn}>
                                <div className={styles.formField}>
                                    <label>
                                        <FaUser className={styles.icon}/> Tên người dùng
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        readOnly
                                    />
                                </div>

                                <div style={{ marginTop: "24px" }} className={styles.formField}>
                                    <label>
                                        <FaUser className={styles.icon}/> Tên đầy đủ
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        onBlur={validateFullName}
                                    />
                                    <p className={styles.errorMsg} style={{
                                        color: "red",
                                        fontSize: "14px",
                                        minHeight: "18px", // giữ không gian khi không có lỗi
                                        visibility: fullNameError ? "visible" : "hidden"
                                    }}>
                                        {fullNameError || "placeholder"} {/* placeholder để giữ chỗ */}
                                    </p>
                                </div>

                                <div className={styles.formField}>
                                    <label>
                                        <FaEnvelope className={styles.icon}/> Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={validateEmail}
                                    />
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        minHeight: "18px",
                                        visibility: emailError ? "visible" : "hidden"
                                    }}>
                                        {emailError || "placeholder"}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.middleColumn}>
                                <div className={styles.formField}>
                                    <label>
                                        <FaBirthdayCake className={styles.icon}/> Ngày Sinh
                                    </label>
                                    <input
                                        type="date"
                                        id="birthday"
                                        value={birthday} // Giá trị ngày sinh đã được định dạng
                                        onChange={(e) => setBirthday(e.target.value)} // Cập nhật ngày sinh khi người dùng thay đổi
                                        placeholder="Chọn ngày sinh"
                                    />
                                </div>

                                <div style={{ marginTop: "24px" }} className={styles.formField}>
                                    <label>
                                        <FaMapMarkerAlt className={styles.icon}/> Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        onBlur={validateAddress}
                                    />
                                    <p style={{
                                        color: "red",
                                        fontSize: "14px",
                                        minHeight: "18px",
                                        visibility: addressError ? "visible" : "hidden"
                                    }}>
                                        {addressError || "placeholder"}
                                    </p>
                                </div>
                                <div className={styles.formField}>
                                    <label>
                                        <FaPhoneAlt className={styles.icon}/> Số điện thoại
                                    </label> <input
                                    type="text"
                                    id="numberphone"
                                    value={numberphone}
                                    onChange={(e) => setNumberphone(e.target.value)}
                                    onBlur={validatePhone}
                                />
                                    {phoneError && <p style={{color: "red", fontSize: "14px"}}>{phoneError}</p>}

                                </div>
                            </div>
                            <div className={styles.rightColumn}>


                                <div className={styles.formField}>
                                    <label htmlFor="gender">Giới tính</label>
                                    <div className={styles.genderSelection}>
                                        {/* Nam */}
                                        <label
                                            className={`${styles.genderOption} ${gender === true ? styles.active : ''}`}
                                            htmlFor="male"
                                        >
                                            <input
                                                type="radio"
                                                id="male"
                                                name="gender"
                                                value="Nam"
                                                checked={gender === true} // True cho 'Nam'
                                                onChange={() => setGender(true)}
                                            />
                                            <span className={styles.icon}>
                👨
            </span>
                                            Nam
                                        </label>

                                        {/* Nữ */}
                                        <label
                                            className={`${styles.genderOption} ${gender === false ? styles.active : ''}`}
                                            htmlFor="female"
                                        >
                                            <input
                                                type="radio"
                                                id="female"
                                                name="gender"
                                                value="Nữ"
                                                checked={gender === false} // False cho 'Nữ'
                                                onChange={() => setGender(false)}
                                            />
                                            <span className={styles.icon}>
                👩
            </span>
                                            Nữ
                                        </label>
                                    </div>
                                </div>


                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '20px',
                            gap: '10px'
                        }}>
                            {/* Nút quay về trang /user */}
                            <button
                                onClick={handleGoBack}
                                style={{
                                    background: 'linear-gradient(145deg, #f1f1f1, #dcdcdc)', // Gradient màu nền
                                    color: '#333',
                                    padding: '14px 22px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)', // Bóng mờ nhẹ
                                    textAlign: 'center',
                                    width: '30%',
                                    whiteSpace: 'nowrap',
                                    transform: 'scale(1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#ddd';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f1f1f1';
                                    e.target.style.transform = 'scale(1)';
                                }}>
                                Quay về
                            </button>

                            {/* Nút chuyển đến trang changePassword */}
                            <button
                                onClick={handleGoToChangePassword}
                                style={{
                                    background: 'linear-gradient(145deg, #8B5E3B, #5A3E2B)', // Gradient màu nâu cà phê
                                    color: 'white',
                                    padding: '14px 22px',
                                    borderRadius: '8px',
                                    border: '1px solid #8B5E3B',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)', // Bóng mờ ấm hơn
                                    textAlign: 'center',
                                    width: '30%',
                                    whiteSpace: 'nowrap',
                                    transform: 'scale(1)',
                                }}

                                onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(145deg, #5A3E2B, #3E2A1E)'; // Đậm hơn khi hover
                                    e.target.style.transform = 'scale(1.05)';
                                }}

                                onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(145deg, #8B5E3B, #5A3E2B)'; // Quay lại màu ban đầu
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                Thay đổi mật khẩu
                            </button>

                            {/* Nút cập nhật thông tin */}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                style={{
                                    background: 'linear-gradient(145deg, #D4A373, #8B5E3B)', // Gradient caramel - socola
                                    color: 'white',
                                    padding: '14px 22px',
                                    borderRadius: '8px',
                                    border: '1px solid #D4A373',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)', // Bóng mờ ấm hơn
                                    textAlign: 'center',
                                    width: '30%',
                                    whiteSpace: 'nowrap',
                                    transform: 'scale(1)',
                                }}

                                onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(145deg, #8B5E3B, #6F4E37)'; // Tông nâu trầm hơn khi hover
                                    e.target.style.transform = 'scale(1.05)';
                                }}

                                onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(145deg, #D4A373, #8B5E3B)'; // Quay lại màu caramel
                                    e.target.style.transform = 'scale(1)';
                                }}

                            >
                                Cập nhật thông tin
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <ToastContainer/>
        </div>

    );
};

export default EditAdmin;
