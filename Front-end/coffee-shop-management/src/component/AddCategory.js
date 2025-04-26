import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Css/CategoryForm.module.css";
import {addCategory, getAllCategories} from "../service/CategoryService"; // Import service đúng cách

const CategoryForm = ({onCancel1}) => {
    const [categoryCode, setCategoryCode] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({ categoryCode: "", categoryName: "" });
    // Lấy danh sách danh mục khi component được mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data); // Lưu danh sách danh mục
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        // Kiểm tra dữ liệu nhập
        if (!categoryCode.trim()) {
            validationErrors.categoryCode = "Mã danh mục không được để trống!";
        } else if (!/^DM\d{2}$/.test(categoryCode.trim())) {
            validationErrors.categoryCode = "Mã danh mục phải có định dạng DM + 2 chữ số (VD: DM01, DM11)!";
        } else if (categories.some(cat => cat.categoryCode === categoryCode.trim())) {
            validationErrors.categoryCode = "Mã danh mục đã tồn tại!";
        }

        if (!categoryName.trim()) {
            validationErrors.categoryName = "Tên danh mục không được để trống!";
        } else if (categories.some(cat => cat.categoryName.toLowerCase() === categoryName.trim().toLowerCase())) {
            validationErrors.categoryName = "Tên danh mục đã tồn tại!";
        }

        // Nếu có lỗi, cập nhật state và dừng submit
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Dữ liệu category cần thêm
        const newCategory = { categoryCode, categoryName };

        try {
            const addedCategory = await addCategory(newCategory);
            toast.success(`Thêm mới thành công: ${addedCategory.categoryName}`);

            // Reset form
            setCategoryCode("");
            setCategoryName("");
            setErrors({});
        } catch (error) {
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
    };


    return (
        <div className={styles.categoryFormr}>
            <h2 className={styles.headingr}>Thêm mới danh mục</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroupr}>
                    <label className={styles.labelr}>Mã danh mục</label>
                    <input
                        type="text"
                        value={categoryCode}
                        onChange={(e) => setCategoryCode(e.target.value)}
                        className={`${styles.inputr} ${errors.categoryCode ? styles.errorInputr : ""}`}
                    />
                    {errors.categoryCode && <p className={styles.errorTextr}>{errors.categoryCode}</p>}
                </div>

                <div className={styles.inputGroupr}>
                    <label className={styles.labelr}>Tên danh mục</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className={`${styles.inputr} ${errors.categoryName ? styles.errorInputr : ""}`}
                    />
                    {errors.categoryName && <p className={styles.errorTextr}>{errors.categoryName}</p>}
                </div>

                <button type="submit" className={styles.buttonr}>Thêm mới</button>
                <button style={{marginTop:"20px"}} onClick={onCancel1} className={styles.buttonr1}>Hủy</button>
            </form>
        </div>
    );
};

export default CategoryForm;
