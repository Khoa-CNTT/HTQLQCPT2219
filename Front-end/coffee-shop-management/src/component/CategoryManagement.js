import React, {useState, useEffect} from "react";
import axios from "axios";
import {getAllCategories} from "../service/CategoryService"; // Import API bạn đã có
import styles from "../Css/CategoryManagement.module.css";
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {FaSearch} from 'react-icons/fa'; // Import icon tìm kiếm từ React Icons
import {updateCategory} from "../service/CategoryService";
import {Modal} from "antd";
import {toast} from "react-toastify";
const CategoryManagement = ({ onAdd1 ,onEdit1}) => {
    const [categories, setCategories] = useState([]);  // Dữ liệu tất cả danh mục
    const [searchCode, setSearchCode] = useState("");  // Mã danh mục tìm kiếm
    const [searchName, setSearchName] = useState("");  // Tên danh mục tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1);    // Tổng số trang
    const [paginatedCategories, setPaginatedCategories] = useState([]);  // Các danh mục đã phân trang sau khi tìm kiếm
    const recordsPerPage = 4; // Mỗi trang có 4 bản ghi
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // Modal xóa
    const [categoryToDeleteCode, setCategoryToDeleteCode] = useState(null);  // Mã danh mục cần xóa


    const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

    const handleDeleteClick = (categoryId) => {
        setCategoryToDeleteId(categoryId);  // Lưu id danh mục cần xóa
        setIsDeleteModalOpen(true);        // Mở modal xác nhận
    };



    useEffect(() => {
        fetchCategories();
    }, [currentPage]); // Chỉ tải lại dữ liệu khi thay đổi trang

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();  // Giả sử bạn lấy tất cả danh mục từ API
            setCategories(data);
            filterCategories(data);  // Lọc danh mục theo tìm kiếm (sau khi click vào nút tìm kiếm)
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    const filterCategories = (data) => {
        // Lọc danh mục theo mã và tên
        const filtered = data.filter(category => {
            return (
                (category.categoryCode.toLowerCase().includes(searchCode.toLowerCase())) &&
                (category.categoryName.toLowerCase().includes(searchName.toLowerCase()))
            );
        });

        setTotalPages(Math.ceil(filtered.length / recordsPerPage));  // Tính số trang cần thiết
        paginateCategories(filtered, currentPage);  // Phân trang kết quả lọc
    };

    const paginateCategories = (data, page) => {
        const offset = (page - 1) * recordsPerPage;
        const currentCategories = data.slice(offset, offset + recordsPerPage);
        setPaginatedCategories(currentCategories);
    };

    const handleSearch = () => {
        // Khi click vào nút Tìm kiếm, thực hiện lọc và phân trang
        filterCategories(categories);  // Lọc và phân trang lại danh mục
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        paginateCategories(categories, page);  // Phân trang lại khi thay đổi trang
    };


    const handleEditClick = async (categoryId) => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage

            const response = await fetch(`http://localhost:8081/api/category/findById/${categoryId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // Thêm Bearer token vào header
                }
            });

            if (!response.ok) {
                throw new Error("Không tìm thấy danh mục hoặc lỗi xác thực");
            }

            const data = await response.json();
            setSelectedCategory(data);  // Lưu dữ liệu để hiển thị trong modal
            setIsEditModalOpen(true);   // Mở modal
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };
    useEffect(() => {
        if (isEditModalOpen) {
            setErrors({}); // Reset lỗi khi mở modal
        }
    }, [isEditModalOpen]);

    const validate = () => {
        let validationErrors = {};

        // Kiểm tra mã danh mục
        if (!selectedCategory.categoryCode.trim()) {
            validationErrors.categoryCode = "Mã danh mục không được để trống!";
        } else if (!/^DM\d{2}$/.test(selectedCategory.categoryCode.trim())) {
            validationErrors.categoryCode = "Mã danh mục phải có định dạng DM + 2 chữ số (VD: DM01, DM11)!";
        } else if (categories.some(cat =>
            cat.categoryCode === selectedCategory.categoryCode.trim() && cat.categoryId !== selectedCategory.categoryId)) {
            validationErrors.categoryCode = "Mã danh mục đã tồn tại!";
        }

        // Kiểm tra tên danh mục
        if (!selectedCategory.categoryName.trim()) {
            validationErrors.categoryName = "Tên danh mục không được để trống!";
        } else if (categories.some(cat =>
            cat.categoryName.toLowerCase() === selectedCategory.categoryName.trim().toLowerCase() && cat.categoryId !== selectedCategory.categoryId)) {
            validationErrors.categoryName = "Tên danh mục đã tồn tại!";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleUpdateCategory = async () => {
        if (!validate()) return; // Dừng lại nếu có lỗi

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8081/api/category/${selectedCategory.categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedCategory)
            });

            if (!response.ok) {
                throw new Error("Lỗi khi cập nhật danh mục");
            }

            const updatedData = await response.json();
            console.log("Đã cập nhật:", updatedData);
            toast.success("Cập nhật danh mục thành công!", {
                position: "top-right",
                autoClose: 3000,
            });

            setIsEditModalOpen(false);  // Đóng modal
            fetchCategories();          // Load lại danh sách
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error);
        }
    };
    const handleDeleteCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/category/${categoryToDeleteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể xóa danh mục");
            }

            fetchCategories(); // Reload danh sách sau khi xóa
            toast.success("Xóa danh mục thành công!", {
                position: "top-right",
                autoClose: 3000,
            });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error);
        }
    };




    return (
        <div className={styles.qContainer}>
            <h2 className={styles.qTitle}>Danh sách nhóm món</h2>

            {/* Form tìm kiếm */}
            <div className={styles.qSearchContainer}>
                <input
                    type="text"
                    placeholder="Tìm theo mã danh mục"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}  // Cập nhật giá trị tìm kiếm
                    className={styles.qSearchInput}
                />
                <input
                    type="text"
                    placeholder="Tìm theo tên danh mục"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}  // Cập nhật giá trị tìm kiếm
                    className={styles.qSearchInput}
                />
                <button
                    className={styles.qSearchButton}
                    onClick={handleSearch} // Chỉ gọi hàm lọc và phân trang khi nhấn nút
                >
                    <FaSearch style={{ marginRight: '5px' }} /> {/* Thêm icon vào bên trái chữ */}
                    Tìm kiếm
                </button>
            </div>

            <div className={styles.qAddButtonContainer}>
                <button className={styles.qAddButton} onClick={onAdd1}>
                    <FaPlus style={{marginRight: '8px'}}/> {/* Thêm icon dấu cộng vào nút */}
                    Thêm danh mục
                </button>
            </div>

            <table className={styles.qCategoryTable}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã danh mục</th>
                    <th>Tên danh mục</th>
                    <th>Tác vụ</th>
                </tr>
                </thead>
                <tbody>
                {paginatedCategories.length > 0 ? (
                    paginatedCategories.map((category, index) => (
                        <tr key={category.categoryId}>
                            <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                            <td>{category.categoryCode}</td>
                            <td>{category.categoryName}</td>
                            <td className={styles.qColumnAction}>
                                    <span className={styles.actionIcon}>
                                    <i className="fas fa-edit" onClick={() => handleEditClick(category.categoryId)}></i>
                                    </span>
                                <span className={styles.actionIcon}>
    <i className="fas fa-trash-alt" onClick={() => handleDeleteClick(category.categoryId)}></i>
</span>

                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Không có danh mục nào</td>
                    </tr>
                )}
                </tbody>
            </table>
            {isDeleteModalOpen && (
                <div className={styles.modalrr}>
                    <div className={styles.modalContentrr}>
                        <h3>Bạn có chắc chắn muốn xóa danh mục này không?</h3>
                        <button onClick={handleDeleteCategory} className={styles.modalButtonrr}>Xóa</button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className={styles.modalButtonrr}>Hủy</button>
                    </div>
                </div>
            )}


            {isEditModalOpen && selectedCategory && (
                <div className={styles.modalOverlayr}>
                    <div className={styles.modalContentr}>
                        <h3>Chỉnh sửa danh mục</h3>

                        <label>Mã danh mục:</label>
                        <input
                            type="text"
                            value={selectedCategory.categoryCode}
                            onChange={(e) =>
                                setSelectedCategory({ ...selectedCategory, categoryCode: e.target.value })
                            }
                            className={errors.categoryCode ? styles.inputErrorr : ""}
                        />
                        {errors.categoryCode && <p className={styles.errorTextr}>{errors.categoryCode}</p>}

                        <label>Tên danh mục:</label>
                        <input
                            type="text"
                            value={selectedCategory.categoryName}
                            onChange={(e) =>
                                setSelectedCategory({ ...selectedCategory, categoryName: e.target.value })
                            }
                            className={errors.categoryName ? styles.inputErrorr : ""}
                        />
                        {errors.categoryName && <p className={styles.errorTextr}>{errors.categoryName}</p>}

                        {/* Bố cục nút */}
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Hủy</button>
                            <button className={styles.saveBtn} onClick={handleUpdateCategory}>Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}



            {/* Phân trang */}
            <div className={styles.paginationq}>
                <button
                    className={styles.buttonq}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Trước
                </button>
                <span className={styles.span1}>Trang {currentPage}/{totalPages}</span>
                <button
                    className={styles.buttonq}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default CategoryManagement;
