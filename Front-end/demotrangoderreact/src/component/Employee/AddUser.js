import React, {useMemo, useState} from "react";
import {Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {
    checkNumberphoneExists,
    checkEmailExists,
    checkUsernameExists1,
    saveEmployeeToAPI, checkPhoneNumber, checkPhoneNumber1, checkEmailExists1,
} from "../../service/UserService";
import {storage} from "../../config/firebaseConfig";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import addStyle from '../../Css/UserAdd.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
// import 'bootstrap-icons/font/bootstrap-icons.css';
import {Modal, Button} from "react-bootstrap"; // Import Modal và Button từ Bootstrap
import styles from '../../Css/UserAdd.module.css';
import {FaEye, FaEyeSlash} from "react-icons/fa";

export default function AddEmployeeForm({onCancel}) {
    const [url, setUrl] = useState(""); // URL của ảnh sau khi upload
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State để điều khiển modal
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImhhdXZpcCIsInN1YiI6ImhhdXZpcCIsImV4cCI6MjA5MDczODU3Mn0.uV13KM04jTu96mzVxIpq6aUky2Swk-cSY-Glm1Qt--E'; // Thay thế bằng token của bạn
    const [showPassword, setShowPassword] = useState(false); // State để kiểm soát việc hiển thị mật khẩu

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Đổi trạng thái hiển thị mật khẩu
    };
    const initialValues= useMemo(() => ({
        username: "",
        fullName: "",
        address: "",
        numberphone: "",
        gender: "", // Gender là chuỗi
        birthday: "",
        // salary: "",
        roleId: "1", // Role chưa chọn
        password: "",
        email: "",
        imgUrl: "", // Thêm trường imgUrl
    }), []);

    const validateEmployee = {
        fullName: Yup.string()
            .trim()
            .required('Họ và tên không được để trống'), // Kiểm tra bắt buộc nhập
        address: Yup.string()
            .trim()
            .required('Địa chỉ không được để trống'), // Thêm điều kiện required
        numberphone: Yup.string()
            .trim()
            .required("Số điện thoại không được để trống")
            .matches(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không đúng định dạng")
            .test("check-duplicate", "Số điện thoại đã tồn tại", async function (value) {
                if (!value) return true; // Nếu không có giá trị thì bỏ qua kiểm tra

                try {
                    const message = await checkPhoneNumber1(value);
                    console.log("Kết quả API:", message); // Debug để xem giá trị trả về

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
                if (!value) return true;

                try {
                    const message = await checkEmailExists1(value);
                    console.log("Kết quả API email:", message);

                    if (message.toLowerCase() === "email có thể sử dụng") return true;  // Sử dụng toLowerCase() để tránh lỗi so sánh
                    if (message.toLowerCase() === "email đã tồn tại") {
                        return this.createError({ path: "email", message: "Email đã tồn tại" });
                    }
                    return this.createError({ path: "email", message: "Email đã tồn tại" });
                } catch (error) {
                    return this.createError({ path: "email", message: "Email đã tồn tại" });
                }
            }),
        username: Yup.string()
            .trim()
            .required("Tên tài khoản không được để trống")
            .test("check-username", "Tên đăng nhập đã tồn tại", async function (value) {
                if (!value) return true; // Nếu không nhập thì bỏ qua kiểm tra
                try {
                    const message = await checkUsernameExists1(value);
                    if (message === "Tên đăng nhập có thể sử dụng") {
                        return true;
                    }
                    return this.createError({ path: "username", message: "Tên đăng nhập đã tồn tại" });
                } catch (error) {
                    return this.createError({ path: "username", message: "Lỗi khi kiểm tra tên đăng nhập" });
                }
            }),
        password: Yup.string()
            .trim()
            .required("Mật khẩu không được để trống")
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt"),
    };

    const handleUpload = async (file, setFieldValue) => {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setFieldValue("imgUrl", downloadURL);
            setUrl(downloadURL);
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

    const handleBack = () => {
        navigate("/dashboard");
    };

    const handleSubmitEmployee = async (values) => {
        console.log("Submitting employee data:", values); // Log dữ liệu của nhân viên
        try {
            await saveEmployeeToAPI(values, token);
            onCancel();
        } catch (error) {
            console.error("Có lỗi xảy ra khi lưu nhân viên.", error);
        }
    };
    // Hàm mở Modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Hàm đóng Modal
    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <div >
            <div >
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmitEmployee}
                    validationSchema={Yup.object(validateEmployee)}
                    // validateOnChange={false}  // Ngăn Formik tự động validate khi nhập
                    // validateOnBlur={false}  // Ngăn Formik tự động validate khi mất focus
                >
                    {({ errors, touched, setFieldTouched,setFieldValue, isValid, isSubmitting  }) => (
                        <Form>
                            <div className={styles.containera}>
                                <div className={styles.formContainera}>
                                    <h4 className={styles.titlea}>Thêm mới Nhân Viên</h4>

                                    {/* Họ và tên */}
                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="fullName">
                                            Họ và tên:<span>*</span>
                                        </label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="fullName"
                                                    onBlur={() => setFieldTouched("fullName", true)} // Đánh dấu input đã được chạm vào
                                                />
                                                {(errors.fullName && touched.fullName) && (
                                                    <div className={styles.errorMessage}>{errors.fullName}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="address">Địa
                                            chỉ:<span>*</span></label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="address"
                                                    onBlur={() => setFieldTouched("address", true)} // Đánh dấu input đã chạm vào
                                                />
                                                {(errors.address && touched.address) && (
                                                    <div className={styles.errorMessage}>{errors.address}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela}>Ngày Sinh:</label>
                                        <div className={styles.inputContainera}>
                                            <Field className={styles.inputa} name="birthday" type="date"/>
                                        </div>
                                    </div>

                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="numberphone">
                                            Số Điện Thoại:<span>*</span>
                                        </label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="numberphone"
                                                    onBlur={(e) => setFieldTouched("numberphone", true)} // Kiểm tra khi mất focus
                                                />
                                                {errors.numberphone && touched.numberphone && (
                                                    <div className={styles.errorMessage}>{errors.numberphone}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="username">
                                            Tên tài khoản:<span>*</span>
                                        </label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="username"
                                                    onBlur={(e) => setFieldTouched("username", true)} // Kiểm tra khi mất focus
                                                />
                                                {errors.username && touched.username && (
                                                    <div className={styles.errorMessage}>{errors.username}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="password">
                                            Mật khẩu:<span>*</span>
                                        </label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}  // Thay đổi loại input khi hiển thị mật khẩu
                                                />
                                                {(errors.password && touched.password) && (
                                                    <div className={styles.errorMessage}>{errors.password}</div>
                                                )}
                                                {/* Icon để hiển thị/ẩn mật khẩu */}
                                                <span
                                                    className={styles.iconWrapper}
                                                    onClick={togglePasswordVisibility}
                                                    style={{cursor: 'pointer'}}
                                                >
                    </span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="email">Email:<span>*</span></label>
                                        <div className={styles.inputContainera}>
                                            <div className={styles.inputWrapper}>
                                                <Field
                                                    className={styles.inputa}
                                                    name="email"
                                                />
                                                {(errors.email && touched.email) && (
                                                    <div className={styles.errorMessage}>{errors.email}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.rowa}>
                                        <label className={styles.labela}>Giới Tính:</label>
                                        <div className={styles.radioGroupa}
                                             style={{marginRight: '490px'}}> {/* Thêm margin-right */}
                                            <label>
                                                <Field type="radio" name="gender" value="true"/>
                                                Nam
                                            </label>
                                            <label>
                                                <Field type="radio" name="gender" value="false"/>
                                                Nữ
                                            </label>
                                        </div>
                                    </div>

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
                                                type="button" // Thêm type="button" để ngăn submit
                                                className={styles.uploadBtna}
                                                style={{marginRight: '505px'}}
                                                onClick={() => document.getElementById('image').click()}
                                            >
                                                Upload Ảnh
                                            </button>
                                            {url && <img className={styles.imagePreviewa} src={url} alt="Uploaded"/>}
                                        </div>
                                    </div>

                                    <div className={styles.rowa}>
                                        <label className={styles.labela} htmlFor="position">Vị
                                            trí:<span>*</span></label>
                                        <div className={styles.inputContainera}>
                                            <Field className={styles.selecta} name="roleId" as="select">
                                                <option value="1">Nhân viên</option>
                                                <option value="2">Admin</option>
                                            </Field>
                                        </div>
                                    </div>

                                    <div className={styles.buttonGroupa}>
                                        <button className={`${styles.btna} ${styles.cancelBtna}`} type="button"
                                                onClick={onCancel}>Cancel
                                        </button>
                                        <button className={`${styles.btna} ${styles.submitBtna}`} type="submit"
                                        >Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    );
}
// <Modal show={showModal} onHide={handleCloseModal}>
//     <Modal.Header closeButton>
//         <Modal.Title>Xác nhận thêm nhân viên</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>Bạn có chắc chắn muốn thêm nhân viên mới này không?</Modal.Body>
//     <Modal.Footer>
//         <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
//         <Button variant="primary" onClick={() => {
//             handleSubmit(); // Thêm nhân viên
//             handleCloseModal(); // Đóng modal sau khi thêm
//         }}>
//             Xác nhận
//         </Button>
//     </Modal.Footer>
// </Modal>
// <div className={styleDashBoard.wrapper}>
//     <div className={styleDashBoard['dashboard-container']}>
//         <div className={styleDashBoard['row-left']}>
//
//         </div>
//         <div className={styleDashBoard['header']}>
//             <div className={styleDashBoard.nav}>nav nhỏ</div>
//         </div>
//         <div className={styleDashBoard['row-right']}>Row Right</div>
//     </div>
//     <div className={styleDashBoard['footer']}>Footer</div>
// </div>