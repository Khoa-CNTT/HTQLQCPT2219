import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Css/ToppingList.module.css';
import { toast } from 'react-toastify';
import {FaSearch} from "react-icons/fa";
import {BiSearch} from "react-icons/bi";

const ToppingList = () => {
    const [toppings, setToppings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearch, setIsSearch] = useState(false);
    const token = localStorage.getItem("token");
    const [showModal, setShowModal] = useState(false);
    const [newTopping, setNewTopping] = useState({ name: '', price: '' });
    const [errors, setErrors] = useState({ name: '', price: '' });
    const recordsPerPage = 4;
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTopping, setEditTopping] = useState({ id: null, name: '', price: '' });
    const [editErrors, setEditErrors] = useState({ name: '', price: '' });
    const handleEditClick = (topping) => {
        setEditTopping(topping);
        setEditErrors({});
        setShowEditModal(true);
    };
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTopping({ ...editTopping, [name]: value });
        setEditErrors({ ...editErrors, [name]: '' });
    };

    const validateEditFields = () => {
        let valid = true;
        const errors = {};

        if (!editTopping.name.trim()) {
            errors.name = "Tên topping không được để trống";
            valid = false;
        }

        if (!editTopping.price || isNaN(editTopping.price) || Number(editTopping.price) <= 0) {
            errors.price = "Giá topping phải là số dương";
            valid = false;
        }

        setEditErrors(errors);
        return valid;
    };

    const handleUpdateTopping = async () => {
        const isValid = validateEditFields();
        if (!isValid) return;

        try {
            const res = await axios.put(`http://localhost:8081/api/topping/update/${editTopping.id}`, editTopping, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Cập nhật thành công!");
            setShowEditModal(false);
            fetchToppings(); // Gọi lại danh sách topping

        } catch (err) {
            if (err.response?.status === 409) {
                // Nếu lỗi trùng tên, hiển thị lỗi dưới ô input
                setEditErrors(prev => ({
                    ...prev,
                    name: err.response.data // Lỗi trùng tên
                }));
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật topping");
            }
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTopping({ ...newTopping, [name]: value });
        setErrors({ ...errors, [name]: '' }); // reset lỗi khi người dùng nhập
    };
    const validateFields = async () => {
        const newErrors = { name: '', price: '' };
        let isValid = true;

        if (!newTopping.name.trim()) {
            newErrors.name = 'Tên topping không được để trống';
            isValid = false;
        } else {
            try {
                const res = await axios.get(`http://localhost:8081/api/topping/search?name=${newTopping.name}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.length > 0) {
                    newErrors.name = 'Tên topping đã tồn tại';
                    isValid = false;
                }
            } catch (err) {
                newErrors.name = 'Lỗi khi kiểm tra tên topping';
                isValid = false;
            }
        }

        if (!newTopping.price.trim()) {
            newErrors.price = 'Giá topping không được để trống';
            isValid = false;
        } else if (isNaN(newTopping.price) || Number(newTopping.price) <= 0) {
            newErrors.price = 'Giá phải là số lớn hơn 0';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleAddTopping = async () => {
        const isValid = await validateFields();
        if (!isValid) return;

        try {
            const res = await axios.post("http://localhost:8081/api/topping/add", newTopping, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("🍫 Thêm topping thành công!");

            setShowModal(false);
            setNewTopping({ name: '', price: '' });
            setErrors({});
            // Gọi lại danh sách nếu cần
        } catch (err) {
            toast.error("❌ Lỗi khi thêm topping");
        }
    };

    useEffect(() => {
        fetchToppings();
    }, []);

    const fetchToppings = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/topping', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setToppings(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tải danh sách topping');
        }
    };

    const handleSearch = async () => {
        console.log("TOKEN:", token);
        try {
            const res = await axios.get(`http://localhost:8081/api/topping/search?name=${searchTerm}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setSearchResult(res.data);
            setIsSearch(true);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tìm kiếm topping');
        }
    };

    const dataToDisplay = isSearch ? searchResult : toppings;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentRecords = dataToDisplay.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(dataToDisplay.length / recordsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedToppingId, setSelectedToppingId] = useState(null);
    const [selectedTopping, setSelectedTopping] = useState(null);

    const handleDeleteClick = (topping) => {
        setSelectedTopping(topping); // lưu object đầy đủ
        setShowDeleteModal(true);
    };


    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:8081/api/topping/delete/${selectedTopping.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Xóa topping thành công!");
            fetchToppings();
        } catch (error) {
            console.error("Lỗi khi xoá topping:", error);
            toast.error("Xoá topping thất bại.");
        } finally {
            setShowDeleteModal(false);
            setSelectedTopping(null);
        }
    };


    return (
        <div className={styles.containerj}>
            <h2 className={styles.titlej}>Danh sách Phụ Liệu</h2>

            <div className={styles.searchContainerj}>
                <input
                    type="text"
                    placeholder="Nhập tên topping..."
                    className={styles.searchInputj}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.searchButtonj} onClick={handleSearch}>
                    <span className={styles.iconSearch11}><BiSearch/></span> Tìm kiếm
                </button>
            </div>
            <button className={styles.addProductButtonj} onClick={() => setShowModal(true)}>
                <i className={`fas fa-plus-circle ${styles.addIconj}`}></i> Thêm mới topping
            </button>
            <table className={styles.tablej}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên Topping</th>
                    <th>Giá (VNĐ)</th>
                    <th>Tác vụ</th>

                </tr>
                </thead>
                <tbody>
                {currentRecords.length === 0 ? (
                    <tr>
                        <td colSpan="3" style={{textAlign: 'center'}}>Không có dữ liệu</td>
                    </tr>
                ) : (
                    currentRecords.map((topping, index) => (
                        <tr key={index}>
                            <td>{firstIndex + index + 1}</td>
                            <td>{topping.name}</td>
                            <td>{topping.price.toLocaleString()}</td>
                            <td className={styles.actionsj}>
                                <button
                                    className={styles.editButtonj}
                                    onClick={() => handleEditClick(topping)}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>

                                <button
                                    className={styles.deleteButtonj}
                                    onClick={() => handleDeleteClick(topping)}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>


                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            {showDeleteModal && selectedTopping && (
                <div className={styles.modalOverlaym}>
                    <div className={styles.modalContentm}>
                        <h2 className={styles.modalTitlem}>
                            Bạn có muốn xóa topping có tên là{" "}
                            <span className={styles.toppingName}>{selectedTopping.name}</span> không?
                        </h2>
                        <div className={styles.modalActionsm}>
                            <button
                                className={styles.cancelButtonm}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.confirmButtonm}
                                onClick={confirmDelete}
                            >
                                Xác nhận xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {showEditModal && (
                <div className={styles.modalOverlayn}>
                    <div className={styles.modalContentn}>
                        <h3 className={styles.modalTitlen}>Chỉnh sửa Phụ Liệu</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Tên topping"
                            value={editTopping.name}
                            onChange={handleEditInputChange}
                            className={styles.modalInputn}
                        />
                        {editErrors.name && <p className={styles.errorTextn}>{editErrors.name}</p>}

                        <input
                            type="number"
                            name="price"
                            placeholder="Giá topping"
                            value={editTopping.price}
                            onChange={handleEditInputChange}
                            className={styles.modalInputn}
                        />
                        {editErrors.price && <p className={styles.errorTextn}>{editErrors.price}</p>}

                        <div className={styles.modalButtonGroupn}>
                            <button
                                className={`${styles.modalButtonn}`}
                                onClick={handleUpdateTopping}
                            >
                                Lưu
                            </button>
                            <button
                                className={`${styles.modalButtonn} ${styles.modalCancelButtonn}`}
                                onClick={() => setShowEditModal(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {showModal && (

                <div className={styles.modalOverlayj}>
                    <div className={styles.modalContentj}>
                        <h3>Thêm mới phụ liệu</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Tên topping"
                            value={newTopping.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <p className={styles.errorj}>{errors.name}</p>}

                        <input
                            type="text"
                            name="price"
                            placeholder="Giá (VNĐ)"
                            value={newTopping.price}
                            onChange={handleInputChange}
                        />
                        {errors.price && <p className={styles.errorj}>{errors.price}</p>}

                        <div className={styles.modalActionsj}>
                            <button onClick={handleAddTopping}>Lưu</button>
                            <button className={styles.cancelBtnj} onClick={() => {
                                setShowModal(false);
                                setNewTopping({ name: '', price: '' });
                                setErrors({});
                            }}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            {totalPages > 1 && (
                <div className={styles.paginationj}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={styles.pageButtonj}
                    >
                        Trước
                    </button>
                    <span className={styles.pageTextj}>
                    Trang {currentPage} / {totalPages}
                </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={styles.pageButtonj}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};
export default ToppingList;
