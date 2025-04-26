import React, { useEffect, useState } from "react";
import { getAllTables } from "../../service/TableService"; // ← import hàm đã tách
import styles from "../../Css/TableList.module.css";
import {BiSearch} from "react-icons/bi";
import {fetchProducts} from "../../service/ProductService";
import * as tableCode from "prettier";
import axios from "axios";
import data from "bootstrap/js/src/dom/data";
import {toast} from "react-toastify";

const TableManager = () => {
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [tableCode, setTableCode] = useState("");
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái modalte;

    const handleSearch = () => {
        loadTables(0); // Reset về trang đầu khi tìm kiếm
    };

    const loadTables = async (page = 0) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get("http://localhost:8081/api/table/searchByCode", {
                params: {
                    tableCode: tableCode.trim() || null,
                    page: page,
                    size: 7,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.content);
            setTables(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    };
    useEffect(() => {
        loadTables(); // Gọi hàm tải sản phẩm ngay khi component render
    }, []);
    const handlePageChange = (newPage) => {
        loadTables(newPage);
    };

    const [newTable, setNewTable] = useState({
        tableCode: "",
        tableName: "",
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const code = newTable.tableCode?.trim().toLowerCase();
        const name = newTable.tableName?.trim().toLowerCase();
        if (!code) {
            newErrors.tableCode = "Mã bàn không được để trống";
        } else if (!/^B\d{2}$/.test(newTable.tableCode)) {
            newErrors.tableCode = "Mã bàn phải có định dạng BXX, trong đó XX là 2 chữ số";
        } else if (Array.isArray(allTable) && allTable.some(p => p.tableCode?.trim().toLowerCase() === code)) {
            newErrors.tableCode = "Mã bàn đã tồn tại";
        }
        if (!name) {
            newErrors.tableName = "Tên bàn không được để trống";
        } else if (allTable.some(p => p.tableName?.trim().toLowerCase() === name)) {
            newErrors.tableName = "Tên bàn đã tồn tại";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

// Hàm reset dữ liệu trong modal
    const resetModalData = () => {
        setNewTable({
            tableCode: '',
            tableName: ''
        });
        setErrors({});
    };

// Khi đóng modal, gọi hàm reset
    useEffect(() => {
        if (!modalVisible) {
            resetModalData();
        }
    }, [modalVisible]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewTable(prev => ({
            ...prev,
            [name]: value
        }));

        // ❌ KHÔNG validate ở đây nữa
    };



    // Hàm xử lý thêm sản phẩm mới
    const handleAddTable = async () => {
        const token = localStorage.getItem("token");
        await loadAllTables(); // Thêm dòng này trước validate

        // ✅ Gọi validate tại đây
        const isValid = validateForm();
        if (!isValid) return;

        try {

            const response = await fetch("http://localhost:8081/api/table/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newTable)
            });

            if (response.ok) {
                const savedTable = await response.json();
                setTables(prev => [savedTable, ...prev]);
                setModalVisible(false);
                toast.success("Thêm mới thành công");
            } else {
                console.error("Lỗi khi thêm bàn mới");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm bàn:", error);
        }
    };
    const [allTable, setAllTables] = useState([]);

    const loadAllTables = async () => {
        try {
            const data = await getAllTables(); // Gọi API không phân trang
            console.log("Dữ liệu trả về từ fetchProducts:", data); // 👉 Log ở đây
            setAllTables(data); // ✅ Đúng
            // Không cần phân trang, lưu thẳng
        } catch (error) {
            console.error("Lỗi khi tải tất cả sản phẩm:", error);
        }
    };
    const handleOpenModal = async () => {
        await loadAllTables(); // Load toàn bộ dữ liệu
        setModalVisible(true);   // Mở modal sau
    };
    useEffect(() => {
        if (modalVisible) {
            loadAllTables();
        }
    }, [modalVisible]);

    const validateEditingTable = () => {
        const errors = {};
        const code = editingTable.tableCode?.trim().toLowerCase();
        const name = editingTable.tableName?.trim().toLowerCase();
        // Validate mã sản phẩm
        if (!code) {
            errors.tableCode = "Mã bàn không được để trống";
        } else if (!/^B\d{2}$/.test(editingTable.tableCode)) {
            errors.tableCode = "Mã bàn phải có định dạng BXX, trong đó XX là 2 chữ số";
        } else if (
            allTable.some(
                (p) => {
                    console.log("ID so sánh:", typeof p.tableId, p.tableId, typeof editingTable.tableId, editingTable.tableId);
                    return Number(p.tableId) !== Number(editingTable.tableId) &&
                        p.tableCode?.trim().toLowerCase() === code;
                }
            )

        ) {
            errors.tableCode = "Mã bàn đã tồn tại";
        }

        // Validate tên sản phẩm
        if (!name) {
            errors.tableName = "Tên bàn không được để trống";
        } else if (
            allTable.some(
                (p) =>
                    Number(p.tableId) !== Number(editingTable.tableId) &&
                    p.tableName?.trim().toLowerCase() === name
            )
        ) {
            errors.tableName = "Tên bàn đã tồn tại";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const [editingTable, setEditingTable] = useState(null); // Sản phẩm đang chỉnh sửa
    const [editModalVisible, setEditModalVisible] = useState(false); // Modal cập nhật

    const updateTable = async () => {
        const token = localStorage.getItem("token");
        if (!validateEditingTable()) return;

        try {
            const response = await fetch(`http://localhost:8081/api/table/${editingTable.tableId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editingTable)
            });

            if (response.ok) {
                toast.success("Cập nhật bàn thành công");
                setEditModalVisible(false); // đóng modal
                loadTables(); // tải lại danh sách sản phẩm
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Đã có lỗi xảy ra khi cập nhật sản phẩm");
        }
    };
    const handleEditClick = async (tableId) => {
        try {
            await loadAllTables(); // <- Load toàn bộ sản phẩm trước
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/table/${tableId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Không tìm thấy sản phẩm");

            const tableData = await response.json();
            setEditingTable(tableData);
            setEditModalVisible(true);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm theo ID:", error);
        }
    };
    const handleCancelEdit = () => {
        // setEditingTable(originalTable); // ← Reset lại form
        setErrors({});                  // ← Reset validate lỗi
        setEditModalVisible(false);     // ← Đóng modal
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null); // chứa thông tin sản phẩm được chọn xoá
    const confirmDelete = (table) => {
        setTableToDelete(table);   // Lưu sản phẩm đang chọn xoá
        setShowDeleteModal(true);      // Hiện modal
    };
    const handleDeleteConfirmed = async () => {
        if (!tableToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/table/${tableToDelete.tableId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                toast.success(" Đã xoá bàn thành công!");
                setShowDeleteModal(false);
                setTableToDelete(null);
                handleSearch(); // Hoặc loadProducts(currentPage)
            } else {
                toast.error(" Xoá thất bại!");
            }
        } catch (error) {
            console.error("Lỗi xoá bàn:", error);
            toast.error("⚠️ Có lỗi xảy ra khi xoá.");
        }
    };
    return (
        <div className={styles.containeri}>
            <h2 className={styles.headerTextt1}>Danh sách bàn</h2>
            {/* Tìm kiếm */}
            <div className={styles.searchContainer11}>
                <input
                    type="text"
                    className={styles.searchInput11}
                    placeholder="Mã bàn"
                    value={tableCode}
                    onChange={(e) => setTableCode(e.target.value)}
                />
                <button className={styles.searchButton11} onClick={handleSearch}>
                    <span className={styles.iconSearch11}><BiSearch/></span> Tìm kiếm
                </button>
            </div>
            <button onClick={handleOpenModal} className={styles.addProductButton11}>
                <i className={`fas fa-plus-circle ${styles.addIcon11}`}></i> Thêm mới bàn
            </button>
            <table className={styles.tablet1}>
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã bàn</th>
                    <th>Tên bàn</th>
                    <th>Tác vụ</th>
                </tr>
                </thead>
                <tbody>
                {tables.map((table,index) => (
                    <tr key={table.tableId}>
                        <td>{currentPage * 4 + index + 1}</td>
                        <td>{table.tableCode}</td>
                        <td>{table.tableName}</td>
                        <td className={styles.actions11}>
                            <button
                                className={styles.editButton11}
                                onClick={() => handleEditClick(table.tableId)}
                            >
                                <i className="fa fa-edit"></i>
                            </button>
                            <button
                                onClick={() => confirmDelete(table)}
                                className={styles.deleteButton11}
                            >
                                <i className="fa fa-trash"></i>
                            </button>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.paginationContainert1}>
                {/* Nút "Trước" */}
                <button
                    className={styles.paginationButtont1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0} // Disable nếu đang ở trang đầu
                >
                    Trước
                </button>

                {/* Hiển thị thông tin trang */}
                <span className={styles.pageInfot1}>
                    Trang {currentPage + 1}/{totalPages}
                </span>

                {/* Nút "Sau" */}
                <button
                    className={styles.paginationButtont1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1} // Disable nếu đang ở trang cuối
                >
                    Sau
                </button>
            </div>
            {showDeleteModal && tableToDelete && (
                <div className={styles.modalOverladd1}>
                    <div className={styles.modalContentdd1}>
                        <h3>Xác nhận xoá</h3>
                        <p>Bạn có muốn xoá sản phẩm có mã: <strong>{tableToDelete.tableCode}</strong> không?</p>
                        <div className={styles.modalButtonsdd1}>
                            <button onClick={handleDeleteConfirmed} className={styles.confirmBtndd1}>Xoá</button>
                            <button onClick={() => setShowDeleteModal(false)} className={styles.cancelBtndd1}>Huỷ</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal thêm sản phẩm */}
            {modalVisible && (
                <div className={styles.modalyTable}>
                    <div className={styles.modalContentyTable}>
                        <h3>Thêm mới bàn</h3>
                        <label>Mã bàn</label>
                        <input
                            type="text"
                            name="tableCode"
                            value={newTable.tableCode}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                            className={styles.searchInputyTable}
                        />
                        {errors.tableCode && <p className={styles.errorTextyTable}>{errors.tableCode}</p>}
                        <label>Tên bàn</label>
                        <input
                            type="text"
                            name="tableName"
                            value={newTable.tableName}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                            className={styles.searchInputyTable}
                        />
                        {errors.tableName && <p className={styles.errorTextyTable}>{errors.tableName}</p>}
                        <div className={styles.modalActionyTable}>
                            <button onClick={handleAddTable} className={styles.searchButtonyTable}>Thêm</button>
                            <button onClick={() => setModalVisible(false)} className={styles.cancelButtonyTable}>Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editModalVisible && editingTable && (
                <div className={styles.modalOverlayt1edit}>
                    <div className={styles.modalt1edit}>
                        <h2>Cập nhật bàn</h2>
                        <label>Mã bàn</label>
                        <input
                            type="text"
                            value={editingTable.tableCode}
                            onChange={(e) => setEditingTable({...editingTable, tableCode: e.target.value})}
                        />
                        {errors.tableCode && <p className={styles.errorTable}>{errors.tableCode}</p>}


                        <label>Tên bàn</label>
                        <input
                            type="text"
                            value={editingTable.tableName}
                            onChange={(e) => setEditingTable({...editingTable, tableName: e.target.value})}
                        />
                        {errors.tableName && <p className={styles.errorTable}>{errors.tableName}</p>}

                        <div className={styles.buttonRowt12}>
                            <button onClick={handleCancelEdit}>Hủy</button>
                            <button onClick={updateTable}>Lưu thay đổi</button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default TableManager;
