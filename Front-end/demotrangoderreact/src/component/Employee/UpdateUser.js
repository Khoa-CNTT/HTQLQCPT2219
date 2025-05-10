import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom'; // Import useNavigate từ React Router v6
import {Formik, Field, Form} from 'formik';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig"; // Import Firebase Storage
import styles from '../../Css/UserAdd.module.css';
import {checkEmailExists1, checkPhoneNumber1, updateUser} from "../../service/UserService";
import {toast} from "react-toastify";
import * as Yup from "yup";

const UpdateUser = ({ userId,onCancel }) => {
    const {id} = useParams(); // Lấy id từ URL
    const navigate = useNavigate(); // Hook điều hướng mới của React Router v6
    const [user, setUser] = useState(null); // State chứa dữ liệu người dùng
    // Khi load form, hiển thị ảnh cũ của user
    const [imagePreview, setImagePreview] = useState(user?.imgUrl || "");
    console.log('Rendering UpdateUser for UserId:', userId);

    useEffect(() => {
        setImagePreview(user?.imgUrl || ""); // Cập nhật lại khi user thay đổi
    }, [user]);

    const handleUpload = async (file, setFieldValue) => {
        const storageRef = ref(storage, `users/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setFieldValue("imgUrl", downloadURL); // Cập nhật Formik với URL ảnh mới
            setImagePreview(downloadURL); // Cập nhật ảnh xem trước
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file, setFieldValue);
        }
    };

    useEffect(() => {
        // Gọi API để lấy thông tin người dùng theo ID
        const getUserById = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8081/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                console.log('UserId in UpdateUser:', userId); // Để kiểm tra giá trị userId trong UpdateUser

                setUser(response.data); // Cập nhật dữ liệu người dùng

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUserById();
    }, [ userId ]);

    if (!user) return <div>Loading...</div>; // Hiển thị loading khi chưa có dữ liệu người dùng

    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Dữ liệu form:", values);
            await updateUser(userId, values, token); // Gọi API cập nhật người dùng

            toast.success('Cập nhật nhân viên thành công!', {
                position: "top-right",
                autoClose: 3000, // Đóng sau 3 giây
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            onCancel(); // Gọi onCancel() giống như khi nhấn nút Hủy
        } catch (error) {
            console.error('Error updating user:', error);

            toast.error('Cập nhật thất bại! Vui lòng thử lại.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required("Họ và tên không được để trống"),
        address: Yup.string()
            .required("Địa chỉ không được để trống"),
        numberphone: Yup.string()
            .trim()
            .required("Số điện thoại không được để trống")
            .matches(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không đúng định dạng")
            .test("check-duplicate", "Số điện thoại đã tồn tại", async function (value) {
                if (!value) return true; // Nếu không có giá trị thì bỏ qua kiểm tra

                const currentPhone = user?.numberphone; // Số điện thoại hiện tại của user

                if (value === currentPhone) {
                    return true; // Nếu số điện thoại không thay đổi, bỏ qua kiểm tra trùng lặp
                }

                try {
                    const message = await checkPhoneNumber1(value);
                    console.log("Kết quả API:", message); // Debug để kiểm tra phản hồi từ API

                    if (message === "Số điện thoại có thể sử dụng") {
                        return true;
                    } else if (message === "Số điện thoại đã tồn tại") {
                        return this.createError({ path: "numberphone", message: "Số điện thoại đã tồn tại" });
                    }
                    return this.createError({ path: "numberphone", message: "Số điện thoại đã tồn tại" });
                } catch (error) {
                    return this.createError({ path: "numberphone", message: "Số điện thoại đã tồn tại" });
                }
            }),
        email: Yup.string()
            .trim()
            .required("Email không được để trống")
            .email("Email không hợp lệ")
            .test("check-email", "Email đã tồn tại", async function (value) {
                if (!value) return true; // Nếu không có giá trị thì bỏ qua kiểm tra

                const currentEmail = user?.email; // Lấy email hiện tại của user

                if (value === currentEmail) {
                    return true; // Nếu email không thay đổi, bỏ qua kiểm tra trùng lặp
                }

                try {
                    const message = await checkEmailExists1(value);
                    console.log("Kết quả API email:", message);

                    if (message.toLowerCase() === "email có thể sử dụng") return true;
                    if (message.toLowerCase() === "email đã tồn tại") {
                        return this.createError({ path: "email", message: "Email đã tồn tại" });
                    }
                    return this.createError({ path: "email", message: "Email đã tồn tại" });
                } catch (error) {
                    return this.createError({ path: "email", message: "Email đã tồn tại" });
                }
            }),

    });
    return (
        <div>
            <Formik
                initialValues={{
                    username: user?.username || "",
                    fullName: user?.fullName || "",
                    address: user?.address || "",
                    numberphone: user?.numberphone || "",
                    gender: user?.gender || false,  // Lưu gender như true hoặc false
                    birthday: user?.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "",
                    roleId: user?.roleId || "1",
                    password: user?.password || "",
                    email: user?.email || "",
                    imgUrl: user?.imgUrl || "", // Lưu ảnh cũ
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema} // Thêm vào đây
                enableReinitialize // Để cập nhật giá trị mặc định khi `user` thay đổi
            >
                {({errors, touched , values, handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                        <div className={styles.containera}>
                            <div className={styles.formContainera}>
                                <h4 className={styles.titlea}>Cập nhật Nhân Viên</h4>

                                {/* Họ và tên */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="fullName">
                                        Họ và tên:<span>*</span>
                                    </label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field className={styles.inputa} name="fullName"/>
                                        </div>
                                        {errors.fullName && touched.fullName && (
                                            <div className={styles.errorMessage}>{errors.fullName}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Địa chỉ */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="address">Địa chỉ:<span>*</span></label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field
                                                className={styles.inputa}
                                                name="address"
                                            />
                                        </div>
                                        {errors.address && touched.address && (
                                            <div className={styles.errorMessage}>{errors.address}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Ngày Sinh */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela}>Ngày Sinh:</label>
                                    <div className={styles.inputContainera}>
                                        <Field className={styles.inputa} name="birthday" type="date"/>
                                    </div>
                                </div>

                                {/* Số Điện Thoại */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="numberphone">
                                        Số Điện Thoại:<span>*</span>
                                    </label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field
                                                className={styles.inputa}
                                                name="numberphone"
                                            />
                                        </div>
                                        {errors.numberphone && touched.numberphone && (
                                            <div className={styles.errorMessage}>{errors.numberphone}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Tên tài khoản */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="username">
                                        Tên tài khoản:<span>*</span>
                                    </label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field
                                                className={styles.inputa}
                                                name="username"
                                                readOnly // Ngăn người dùng chỉnh sửa
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mật khẩu */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="password">
                                        Mật khẩu:<span>*</span>
                                    </label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field
                                                className={styles.inputa}
                                                name="password"
                                                type="password"
                                                readOnly // Ngăn người dùng chỉnh sửa
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="email">Email:<span>*</span></label>
                                    <div className={styles.inputContainera}>
                                        <div className={styles.inputWrapper}>
                                            <Field
                                                className={styles.inputa}
                                                name="email"
                                            />
                                        </div>
                                        {errors.email && touched.email && (
                                            <div className={styles.errorMessage}>{errors.email}</div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.rowa}>
                                    <label className={styles.labela}>Giới Tính:</label>
                                    <div className={styles.radioGroupa} style={{marginRight: '490px'}}>
                                        <label>
                                            <Field
                                                type="radio"
                                                name="gender"
                                                value="true"
                                                checked={values.gender === true}
                                                onChange={() => setFieldValue("gender", true)} // Cập nhật giá trị khi chọn
                                            />
                                            Nam
                                        </label>
                                        <label>
                                            <Field
                                                type="radio"
                                                name="gender"
                                                value="false"
                                                checked={values.gender === false}
                                                onChange={() => setFieldValue("gender", false)} // Cập nhật giá trị khi chọn
                                            />
                                            Nữ
                                        </label>
                                    </div>
                                </div>


                                {/* Upload ảnh */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="image">Ảnh:</label>
                                    <div className={styles.uploadContainera}>
                                        <input
                                            type="file"
                                            id="image"
                                            onChange={(e) => handleImageChange(e, setFieldValue)}
                                            style={{display: 'none'}}
                                        />
                                        <button
                                            type="button"
                                            className={styles.uploadBtna}
                                            style={{marginRight: '505px'}}
                                            onClick={() => document.getElementById('image').click()}
                                        >
                                            Upload Ảnh
                                        </button>
                                        {imagePreview &&
                                            <img className={styles.imagePreviewa} src={imagePreview} alt="Uploaded"/>}
                                    </div>
                                </div>

                                {/* Vị trí */}
                                <div className={styles.rowa}>
                                    <label className={styles.labela} htmlFor="roleId">Vị trí:<span>*</span></label>
                                    <div className={styles.inputContainera}>
                                        <Field className={styles.selecta} name="roleId" as="select">
                                            <option value="1">Nhân viên</option>
                                            <option value="2">Admin</option>
                                        </Field>
                                    </div>
                                </div>

                                {/* Button */}
                                <div className={styles.buttonGroupa}>
                                    <button
                                        className={`${styles.btna} ${styles.cancelBtna}`}
                                        type="button"
                                        onClick={onCancel}  // Gọi hàm onCancel khi nhấn Hủy
                                    >
                                        Hủy
                                    </button>
                                    <button className={`${styles.btna} ${styles.submitBtna}`} type="submit">
                                        Cập Nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>

                )}
            </Formik>
        </div>
    );
};


export default UpdateUser;
