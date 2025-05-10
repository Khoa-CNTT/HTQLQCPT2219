import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {useForm} from "react-hook-form";

import {yupResolver} from "@hookform/resolvers/yup";
import * as userService from "../../service/UserService";
import {toast} from "react-toastify";
import styles from "./login.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faLock, faUser} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";
import React, {useState} from "react";
import coffeeBg from '../../img/anh-cafe_2.jpg';

const Login = () => {
    const navigate = useNavigate();
    const schema = Yup.object().shape({
        username: Yup.string().required("Bạn chưa nhập username"),
        password: Yup.string().required("bạn chưa nhập mật khẩu")
    })
    const { register, handleSubmit,setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const token = localStorage.getItem('token');
    const onSubmit = async (data) => {
        try {
            // Gọi API đăng nhập
            const response = await userService.Login(data.username, data.password);

            // Xử lý phản hồi từ API
            if (typeof response === 'object') {
                // Lấy role từ localStorage
                const role = JSON.parse(localStorage.getItem('roles'));
                console.log('Role:', role);

                // Kiểm tra vai trò và chuyển hướng
                if (role?.roleName === "ROLE_USER") {
                    // Nếu role là ROLE_USER, chuyển hướng tới trang /user
                    navigate('/user');
                    toast.success('Đăng nhập thành công! Chào mừng bạn trở lại!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else if (role?.roleName === "ROLE_ADMIN") {
                    // Nếu role là ROLE_ADMIN, chuyển hướng tới trang /dashboard
                    navigate('/dashboard');
                    toast.success('Đăng nhập thành công với vai trò ADMIN!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    console.error('Role không hợp lệ hoặc không phải ROLE_USER hay ROLE_ADMIN');
                }
            } else if (response === 404) {
                setError('username', {
                    type: 'server',
                    message: 'Tài khoản này không tồn tại',
                });
            } else if (response === 500) {
                setError('password', {
                    type: 'server',
                    message: 'Mật khẩu không đúng',
                });
            } else if (response === 400) {
                toast.error('Tài khoản của bạn chưa cập nhật 30 ngày, cần thay đổi lại!', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            toast.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // đăng nhập với google
    const handleGoogleLogin = () => {
        alert("Đăng nhập với Google thành công!");
    };

    // đăng nhập với facebook
    const handleFacebookLogin = () => {
        alert("Đăng nhập với Facebook thành công!");
    };
    return (
        <div className={styles.loginContainer}>
            {/* Phần bên trái chứa background */}
            <div className={styles.leftPanel} style={{backgroundImage: `url(${coffeeBg})`}}>
                {/*<h1 className={styles.brandText}>Welcome Back! ☕</h1>*/}
            </div>

            {/* Phần bên phải chứa form đăng nhập */}
            <div className={styles.rightPanel}>
                <div className={styles.loginBox}>
                    <div className={styles.loginHeader}>
                        <FontAwesomeIcon icon={faKey} className={styles.icon}/>
                        <h2 className={styles.headerText}>Đăng nhập</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputWithIcon}>
                                <FontAwesomeIcon icon={faUser} className={styles.inputIcon}/>
                                <input
                                    type="text"
                                    className={styles.formControl}
                                    placeholder="Tên đăng nhập"
                                    {...register('username')}
                                />
                            </div>
                            {errors.username && <p className={styles.errorTextlo}>{errors.username.message}</p>}
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.inputWithIcon}>
                                <FontAwesomeIcon icon={faLock} className={styles.inputIcon}/>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.formControl}
                                    placeholder="Mật khẩu"
                                    {...register('password')}
                                />
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className={styles.showPasswordButton}*/}
                                {/*    onClick={togglePasswordVisibility}*/}
                                {/*>*/}
                                {/*    {showPassword ? 'Ẩn' : 'Hiện'}*/}
                                {/*</button>*/}
                            </div>
                            {errors.password && <p className={styles.errorTextlo}>{errors.password.message}</p>}
                        </div>

                        <button type="submit" className={styles.btnSubmit}>Đăng nhập</button>
                    </form>

                    {/*<div className={styles.links}>*/}
                    {/*    <Link to="/forgot-password" className={styles.forgotPassword}>Quên mật khẩu?</Link>*/}
                    {/*    <Link to="/register" className={styles.registerLink}>Đăng ký ngay</Link>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );


//     return (
//         <div>
//             {/*<Header/>*/}
//             <div className={styles.loginContainer}>
//                 <div className={styles.loginBox}>
//                     <div className={styles.loginHeader}>
//                         <FontAwesomeIcon icon={faKey} className={`${styles.icon} ${styles.iconAnimate}`} />
//                         <h2 className={`${styles.headerText} ${styles.headerTextAnimate}`}>Login</h2>
//                     </div>
//
//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//
//                     >
//
//                         <div className={`${styles.formGroup} ${styles.formInput}`}>
//                             <div className={styles.inputWithIcon}>
//                                 <FontAwesomeIcon icon={faUser} className={styles.inputIcon}/>
//                                 <input
//                                     type="text"
//                                     className={`${styles.formControl} ${errors.username ? styles.error : ''}`}
//                                     placeholder="Username"
//                                     aria-label="username"
//                                     {...register('username')}
//                                 />
//                             </div>
//                             {errors.username && <p className={styles.displayErrors}>{errors.username.message}</p>}
//                         </div>
//
//
//                         <div className={`${styles.formGroup} ${styles.formInput}`}>
//                             <div className={styles.inputWithIcon}>
//                                 <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
//                                 <input
//                                     type="password"
//                                     className={`${styles.formControl} ${errors.password ? styles.error : ''}`}
//                                     placeholder="Password"
//                                     aria-label="password"
//                                     {...register('password')}
//                                 />
//                             </div>
//                             {errors.password && <p className={styles.displayErrors}>{errors.password.message}</p>}
//                         </div>
//
//                         <button type="submit" className={styles.btnSubmit}>Login</button>
//                     </form>
//                     <div className={styles.formGroup}>
//                         <Link to='/forgot-password' className={styles.forgotPasswordLink}>
//                             Quên mật khẩu
//                         </Link>
//                     </div>
//
//
//                     <div className={styles.socialLogin}>
//                         <p>Or login with</p>
//                         <button
//                             id="googleLogin"
//                             className={`${styles.socialBtn} ${styles.googleBtn}`}
//                             onClick={handleGoogleLogin}
//                         >
//                             <FontAwesomeIcon icon={faGoogle} />Login with Google
//                         </button>
//                         <button
//                             id="facebookLogin"
//                             className={`${styles.socialBtn} ${styles.facebookBtn}`}
//                             onClick={handleFacebookLogin}
//                         >
//                             <FontAwesomeIcon icon={faFacebook} /> Login with Google
//                         </button>
//                     </div>
//
//                     <div className={styles.registerLink}>
//                         <div>
//                             <p>Bạn chưa có tài khoản?</p>
//                         </div>
//                         <div>
//                             {/* eslint-disable-next-line react/jsx-no-undef */}
//                             <Link to="/register" className={styles.registerBtn}>Đăng ký</Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/*<Footer/>*/}
//         </div>
//     );
};
            export default Login;