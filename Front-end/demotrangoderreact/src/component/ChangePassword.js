import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Css/ChangePassword.module.css';
import {FaLock, FaArrowRight, FaArrowLeft} from 'react-icons/fa'; // Import các icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [userInputCaptcha, setUserInputCaptcha] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Khởi tạo navigate

    // Các state và logic ở đây...

    const handleGoBack = () => {
        navigate('/edit-user'); // Chuyển hướng đến trang /user-edit
    };
    const generateCaptcha = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captchaString = '';
        for (let i = 0; i < 6; i++) {
            captchaString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(captchaString);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và mật khẩu xác nhận không khớp.');
            return;
        }

        if (userInputCaptcha !== captcha) {
            toast.error('Mã CAPTCHA không đúng!');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8081/api/verify/change-password', {
                params: {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                toast.success('Đã thay đổi mật khẩu thành công');
            }
        } catch (error) {
            if (error.response) {
                // Lấy lỗi từ response nếu có
                toast.error(`Lỗi từ server: ${error.response.data}`);
            } else if (error.request) {
                // Lỗi do không có phản hồi từ server
                toast.error('Không nhận được phản hồi từ server.');
            } else {
                // Các lỗi khác
                toast.error(`Đã có lỗi xảy ra: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.changePasswordPage}>
            <div className={styles.changePasswordContainer}>
                <h2 className={styles.changePasswordHeader}>Thay đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword} className={styles.changePasswordForm}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Mật khẩu cũ:</label>
                        <div className={styles.inputContainer}>
                            <FaLock className={styles.inputIcon}/>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className={styles.changePasswordInput}
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Mật khẩu mới:</label>
                        <div className={styles.inputContainer}>
                            <FaLock className={styles.inputIcon}/>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.changePasswordInput}
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Xác nhận mật khẩu mới:</label>
                        <div className={styles.inputContainer}>
                            <FaLock className={styles.inputIcon}/>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.changePasswordInput}
                            />
                        </div>
                    </div>
                    <div className={styles.changePasswordCaptchaContainer}>
                        <input
                            type="text"
                            value={userInputCaptcha}
                            onChange={(e) => setUserInputCaptcha(e.target.value)}
                            className={styles.changePasswordCaptchaInput}
                        />
                        <div className={styles.changePasswordCaptchaText}>{captcha}</div>
                    </div>
                    <button type="submit" className={styles.changePasswordButton}>
                        <FaArrowRight className="icon"/>
                        Thay đổi mật khẩu
                    </button>
                </form>
                <button onClick={handleGoBack} className={styles.goBackButton}>
                    <FaArrowLeft className="icon"/>
                    Quay lại
                </button>
                {message && <p className={styles.changePasswordMessage}>{message}</p>}
            </div>
            <ToastContainer />
        </div>
    );
};
export default ChangePassword;
