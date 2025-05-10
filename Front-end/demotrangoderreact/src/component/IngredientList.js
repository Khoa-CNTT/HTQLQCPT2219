import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../Css/IngredientList.module.css";
import {BiSearch} from "react-icons/bi";
import {toast} from "react-toastify";

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');  // Giá trị nhập tạm thời
    const [page, setPage] = useState(0);
    const [size] = useState(7);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [editErrors, setEditErrors] = useState({});
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        unit: '',
        quantityInStock: '',
        minimumStock: ''
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);  // Modal xác nhận xóa
    const [ingredientToDelete, setIngredientToDelete] = useState(null);  // Nguyên liệu cần xóa
    const [addErrors, setAddErrors] = useState({});
    const openAddModal = () => {
        setNewIngredient({ name: '', unit: '', quantityInStock: '', minimumStock: '' });
        setAddErrors({});
        setAddModalOpen(true);
    };
    const handleDeleteClick = (ingredient) => {
        setIngredientToDelete(ingredient);  // Lưu nguyên liệu cần xóa
        setDeleteModalOpen(true);  // Mở modal xác nhận
    };

    const handleConfirmDelete = async () => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Gửi yêu cầu xóa nguyên liệu từ backend
            await axios.delete(`http://localhost:8081/api/ingredients/${ingredientToDelete.id}`, { headers });

            // Cập nhật lại danh sách
            setIngredients(ingredients.filter(ing => ing.id !== ingredientToDelete.id));

            // Hiển thị thông báo toast
            toast.success('Nguyên liệu đã được xóa thành công!');

            // Đóng modal sau khi xóa thành công
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Xóa nguyên liệu thất bại:', error);
            toast.error('Xóa nguyên liệu thất bại!');  // Hiển thị thông báo lỗi nếu xóa không thành công
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);  // Đóng modal nếu người dùng hủy
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };
    const validateAddForm = async () => {
        const errors = {};

        if (!newIngredient.name.trim()) {
            errors.name = 'Tên không được để trống';
        } else {
            try {
                const res = await axios.get(
                    `http://localhost:8081/api/ingredients/check-name?name=${newIngredient.name}`,
                    { headers }
                );
                if (res.data === true) {
                    errors.name = 'Tên này đã tồn tại trong hệ thống';
                }
            } catch (error) {
                console.error("Lỗi kiểm tra tên:", error);
            }
        }

        if (!newIngredient.unit.trim()) {
            errors.unit = 'Đơn vị không được để trống';
        }

        if (
            newIngredient.quantityInStock === '' ||
            isNaN(newIngredient.quantityInStock)
        ) {
            errors.quantityInStock = 'Số lượng tồn kho phải là số';
        }

        if (
            newIngredient.minimumStock === '' ||
            isNaN(newIngredient.minimumStock)
        ) {
            errors.minimumStock = 'Tồn kho tối thiểu phải là số';
        }

        setAddErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddIngredient = async () => {
        const isValid = await validateAddForm();
        if (!isValid) return;

        try {
            await axios.post(
                `http://localhost:8081/api/ingredients`,
                newIngredient,
                { headers }
            );
            toast.success('✅ Thêm nguyên liệu thành công!');
            closeAddModal();
            fetchIngredients(); // Refresh lại danh sách
        } catch (error) {
            console.error("Lỗi thêm nguyên liệu:", error);
            toast.error("❌ Có lỗi xảy ra khi thêm nguyên liệu.");
        }
    };

    const validateEditForm = async () => {
        const errors = {};

        if (!selectedIngredient.name || selectedIngredient.name.trim() === '') {
            errors.name = 'Tên không được để trống';
        } else {
            // Kiểm tra trùng tên nếu tên đã thay đổi
            const isNameChanged = ingredients.find(
                (i) => i.id === selectedIngredient.id
            )?.name !== selectedIngredient.name;

            if (isNameChanged) {
                try {
                    const res = await axios.get(
                        `http://localhost:8081/api/ingredients/check-name?name=${selectedIngredient.name}`,
                        { headers }
                    );
                    if (res.data === true) {
                        errors.name = 'Tên này đã tồn tại trong hệ thống';
                    }
                } catch (error) {
                    console.error("Lỗi kiểm tra tên trùng:", error);
                }
            }
        }

        // validate các trường còn lại như trước
        if (
            selectedIngredient.quantityInStock === '' ||
            selectedIngredient.quantityInStock === null ||
            isNaN(selectedIngredient.quantityInStock)
        ) {
            errors.quantityInStock = 'Số lượng phải là số hợp lệ';
        }

        if (
            selectedIngredient.minimumStock === '' ||
            selectedIngredient.minimumStock === null ||
            isNaN(selectedIngredient.minimumStock)
        ) {
            errors.minimumStock = 'Tối thiểu phải là số hợp lệ';
        }

        if (!selectedIngredient.unit || selectedIngredient.unit.trim() === '') {
            errors.unit = 'Đơn vị không được để trống';
        }

        setEditErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleEditClick = (ingredient) => {
        setSelectedIngredient({ ...ingredient }); // clone để chỉnh riêng
        setEditErrors({}); // 👉 Xóa lỗi cũ khi mở modal mới
        setEditModalOpen(true);
    };

    const handleUpdateIngredient = async () => {
        if (!selectedIngredient) return;

        const isValid = await validateEditForm();
        if (!isValid) return;

        try {
            await axios.put(
                `http://localhost:8081/api/ingredients/${selectedIngredient.id}`,
                selectedIngredient,
                { headers }
            );
            setEditModalOpen(false);
            fetchIngredients();
            toast.success("Cập nhật nguyên liệu thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật nguyên liệu:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật nguyên liệu.");
        }
    };


    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedIngredient(null);
        setEditErrors({}); // 👉 Reset lỗi khi tắt modal
    };


    // Lấy danh sách nguyên liệu có phân trang
    const fetchIngredients = async () => {
        try {
            const endpoint = keyword
                ? `http://localhost:8081/api/ingredients/search?keyword=${keyword}&page=${page}&size=${size}`
                : `http://localhost:8081/api/ingredients?page=${page}&size=${size}`;

            const response = await axios.get(endpoint, { headers });
            setIngredients(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải nguyên liệu:', error);
        }
    };

    // Gọi API low-stock đã được backend xử lý
    const fetchLowStockItems = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/ingredients/low-stock', { headers });
            const lowStock = response.data;
            setLowStockItems(lowStock);
            if (lowStock && lowStock.length > 0) {
                setShowModal(true);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách cảnh báo:', error);
        }
    };

    // Lấy dữ liệu khi component được mount, và mỗi khi phân trang tìm kiếm thay đổi cũng tải lại danh sách chính
    useEffect(() => {
        fetchIngredients();
    }, [page, keyword]);

    // Chỉ gọi API kiểm tra nguyên liệu tồn thấp một lần khi component mount
    useEffect(() => {
        fetchLowStockItems();
    }, []);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value); // Không ảnh hưởng ngay tới tìm kiếm
    };

    const handleSearchClick = () => {
        setKeyword(searchInput);
        setPage(0); // Reset về trang đầu tiên
    };


    const handlePrevPage = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={styles.containeri1}>
            <h2 className={styles.headerTextt11}>Danh Sách Nguyên Liệu</h2>

            <div className={styles.searchContainer111}>
                <input
                    type="text"
                    placeholder="Tìm nguyên liệu..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className={styles.searchInput111}
                />
                <button onClick={handleSearchClick} className={styles.searchButton111}>
                    <span className={styles.iconSearch111}><BiSearch/></span> Tìm kiếm
                </button>
            </div>
            <button className={styles.addProductButton111} onClick={openAddModal}>
                <i className={`fas fa-plus-circle ${styles.addIcon111}`}></i> Thêm mới nguyên liệu
            </button>


            <table className={styles.tablet11}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên</th>
                    <th>Số lượng</th>
                    <th>Tối thiểu</th>
                    <th>Đơn vị</th>
                    <th>Tác vụ</th>
                </tr>
                </thead>
                <tbody>
                {ingredients.length > 0 ? (
                    ingredients.map((ing, index) => (
                        <tr key={ing.id}>
                            <td>{page * size + index + 1}</td>
                            <td>{ing.name}</td>
                            <td>{ing.quantityInStock}</td>
                            <td>{ing.minimumStock}</td>
                            <td>{ing.unit}</td>
                            <td className={styles.actions111}>
                                <button
                                    className={styles.editButton111}
                                    onClick={() => handleEditClick(ing)}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button
                                    className={styles.deleteButton111}
                                    onClick={() => handleDeleteClick(ing)}  // Gọi phương thức xóa khi nhấn vào icon xóa

                                >
                                    <i className="fa fa-trash"></i>
                                </button>

                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{textAlign: 'center'}}>Không có dữ liệu</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className={styles.paginationContainert11}>
                <button className={styles.paginationButtont11} onClick={handlePrevPage} disabled={page === 0}>Trước
                </button>
                <span className={styles.pageInfot11}>Trang {page + 1} / {totalPages}</span>
                <button className={styles.paginationButtont11} onClick={handleNextPage}
                        disabled={page >= totalPages - 1}>Sau
                </button>
            </div>
            {/* Modal xác nhận xóa */}
            {/* Modal xác nhận xóa */}
            {deleteModalOpen && ingredientToDelete && (
                <div className={`${styles.modalBackdrop4} ${deleteModalOpen ? styles.open : ''}`}>
                    <div className={styles.modalContent4}>
                        <h3 className={styles.modalTitle4}>Xác nhận xóa</h3>
                        <p className={styles.modalMessage4}>
                            Bạn có chắc chắn muốn xóa nguyên liệu "{ingredientToDelete.name}"?
                        </p>
                        <div className={styles.buttonsContainer4}>
                            <button
                                onClick={handleConfirmDelete}
                                className={`${styles.modalButton4} ${styles.deleteButton4}`}
                            >
                                Xóa
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className={`${styles.modalButton4} ${styles.cancelButton4}`}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {addModalOpen && (
                <div className={styles.modal3}>
                    <div className={styles.modalContent3}>
                        <h2>Thêm mới nguyên liệu</h2>

                        <label htmlFor="name">Tên:</label>
                        <input
                            id="name"
                            value={newIngredient.name}
                            onChange={(e) =>
                                setNewIngredient({ ...newIngredient, name: e.target.value })
                            }
                        />
                        {addErrors.name && <p className={styles.error3}>{addErrors.name}</p>}

                        <label htmlFor="quantityInStock">Số lượng tồn kho:</label>
                        <input
                            id="quantityInStock"
                            value={newIngredient.quantityInStock}
                            onChange={(e) =>
                                setNewIngredient({
                                    ...newIngredient,
                                    quantityInStock: e.target.value,
                                })
                            }
                        />
                        {addErrors.quantityInStock && (
                            <p className={styles.error3}>{addErrors.quantityInStock}</p>
                        )}

                        <label htmlFor="minimumStock">Tồn kho tối thiểu:</label>
                        <input
                            id="minimumStock"
                            value={newIngredient.minimumStock}
                            onChange={(e) =>
                                setNewIngredient({
                                    ...newIngredient,
                                    minimumStock: e.target.value,
                                })
                            }
                        />
                        {addErrors.minimumStock && (
                            <p className={styles.error3}>{addErrors.minimumStock}</p>
                        )}

                        <label htmlFor="unit">Đơn vị:</label>
                        <input
                            id="unit"
                            value={newIngredient.unit}
                            onChange={(e) =>
                                setNewIngredient({ ...newIngredient, unit: e.target.value })
                            }
                        />
                        {addErrors.unit && <p className={styles.error3}>{addErrors.unit}</p>}

                        <div className={styles.buttonGroup3}>
                            <button onClick={handleAddIngredient}>Thêm mới</button>
                            <button onClick={closeAddModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {editModalOpen && selectedIngredient && (
                <div className={styles.modal3}>
                    <div className={styles.modalContent3}>
                        <h2>Chỉnh sửa nguyên liệu</h2>

                        <label>Tên:</label>
                        <input
                            type="text"
                            value={selectedIngredient.name}
                            onChange={(e) =>
                                setSelectedIngredient((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                        {editErrors.name && <p className={styles.error3}>{editErrors.name}</p>}

                        <label>Số lượng tồn:</label>
                        <input
                            type="number"
                            value={selectedIngredient.quantityInStock}
                            onChange={(e) =>
                                setSelectedIngredient((prev) => ({
                                    ...prev,
                                    quantityInStock: parseFloat(e.target.value),
                                }))
                            }
                        />
                        {editErrors.quantityInStock && (
                            <p className={styles.error3}>{editErrors.quantityInStock}</p>
                        )}

                        <label>Ngưỡng tối thiểu:</label>
                        <input
                            type="number"
                            value={selectedIngredient.minimumStock}
                            onChange={(e) =>
                                setSelectedIngredient((prev) => ({
                                    ...prev,
                                    minimumStock: parseFloat(e.target.value),
                                }))
                            }
                        />
                        {editErrors.minimumStock && (
                            <p className={styles.error3}>{editErrors.minimumStock}</p>
                        )}

                        <label>Đơn vị:</label>
                        <input
                            type="text"
                            value={selectedIngredient.unit}
                            onChange={(e) =>
                                setSelectedIngredient((prev) => ({ ...prev, unit: e.target.value }))
                            }
                        />
                        {editErrors.unit && <p className={styles.error3}>{editErrors.unit}</p>}

                        <div className={styles.buttonGroup3}>
                            <button onClick={handleUpdateIngredient}>Lưu</button>
                            <button onClick={closeEditModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}


            {showModal && (
                <div className={styles.backdrop}>
                    <div className={styles.modalContent2}>
                        <h3 className={styles.title2}>⚠️ Cảnh Báo Tồn Kho</h3>
                        <ul className={styles.warningList2}>
                            {lowStockItems.map((item) => (
                                <li key={item.id} className={styles.warningItem2}>
                                    <strong>{item.name}</strong> đã đạt ngưỡng cảnh báo!
                                    (Tồn: {item.quantityInStock} {item.unit})
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeModal} className={styles.closeButton2}>Đã hiểu</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default IngredientList;
