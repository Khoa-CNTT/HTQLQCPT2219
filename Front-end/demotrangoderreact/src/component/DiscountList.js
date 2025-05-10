import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from "../Css/TableList.module.css";
import styles1 from "../Css/ProductList.module.css";
import {BiSearch} from "react-icons/bi";
import styles2 from '../Css/ModalEditDiscount.module.css';
import styles3 from '../Css/ModalCreateDiscount.module.css'
import styles4 from '../Css/DeleteModal.module.css'
import {toast} from "react-toastify";
const DiscountList = () => {
    const [discounts, setDiscounts] = useState([]);
    const [code, setCode] = useState("");
    const [value, setValue] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(4); // Số item mỗi trang
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const token = localStorage.getItem("token");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [formData, setFormData] = useState({code: "", value: "", status: true});
    const handleEditClick = async (discount) => {
        setSelectedDiscount(discount);
        setErrors({ code: "", value: "" }); // reset trước
        setFormData({
            code: discount.code,
            value: discount.value,
            status: discount.status,
        });
        await fetchAllDiscounts();
        setShowEditModal(true); // mở modal sau khi mọi thứ đã sẵn sàng
    };

    const [errors, setErrors] = useState({
        code: "",
        value: "",
    });

    const handleUpdate = async () => {
        const newErrors = { code: "", value: "" };

        // Validate code
        if (formData.code.trim() === "") {
            newErrors.code = "Mã code không được để trống!";
        } else {
            const isDuplicate = allDiscounts.some(
                (d) => d.code === formData.code && d.id !== selectedDiscount.id
            );
            if (isDuplicate) {
                newErrors.code = "Mã code đã tồn tại trong hệ thống!";
            }
        }

        // Validate value
        if (formData.value === "" || isNaN(formData.value)) {
            newErrors.value = "Giá trị giảm giá phải là một số và không được để trống!";
        }

        // Nếu có lỗi, dừng lại và hiển thị lỗi
        if (newErrors.code || newErrors.value) {
            setErrors(newErrors);
            return;
        }

        try {
            await axios.put(
                `http://localhost:8081/api/discounts/${selectedDiscount.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Cập nhập mã giảm giá thành công", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setShowEditModal(false);
            fetchData(); // Load lại danh sách
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };



    const fetchData = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8081/api/discounts?page=${page}&size=${size}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDiscounts(res.data.content);
            setTotalPages(res.data.totalPages);
            setIsSearching(false);
        } catch (err) {
            console.error(err);
        }
    };
    const [allDiscounts, setAllDiscounts] = useState([]);

    const fetchAllDiscounts = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/discounts?page=0&size=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllDiscounts(res.data.content); // vẫn lấy .content nhé vì là Page object
        } catch (err) {
            console.error("Lỗi khi lấy toàn bộ mã giảm giá:", err);
        }
    };
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({ code: "", value: "", status: true });
    const [createErrors, setCreateErrors] = useState({ code: "", value: "" });
    const handleCreate = async () => {
        const errors = { code: "", value: "" };

        // Kiểm tra rỗng
        if (createForm.code.trim() === "") {
            errors.code = "Mã khuyến mãi không được để trống!";
        } else {
            // Kiểm tra trùng code (bỏ qua khoảng trắng và phân biệt hoa thường nếu muốn)
            const isDuplicate = allDiscounts.some(
                (item) => item.code.trim().toLowerCase() === createForm.code.trim().toLowerCase()
            );
            if (isDuplicate) {
                errors.code = "Mã khuyến mãi đã tồn tại!";
            }
        }

        // Kiểm tra value
        if (createForm.value === "" || isNaN(createForm.value)) {
            errors.value = "Giá trị phải là số và không được để trống!";
        }

        if (errors.code || errors.value) {
            setCreateErrors(errors);
            return;
        }

        try {
            await axios.post("http://localhost:8081/api/discounts", createForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Thêm mã giảm giá thành công ", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setShowCreateModal(false);
            setCreateForm({ code: "", value: "", status: true });
            fetchData(); // Load lại danh sách chính
        } catch (err) {
            console.error("Lỗi khi thêm mới khuyến mãi:", err);
        }
    };

    const openCreateModal = () => {
        fetchAllDiscounts(); // lấy danh sách code để kiểm tra trùng
        setShowCreateModal(true);
    };


    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (code) params.append("code", code);
            if (value) params.append("value", value);
            params.append("page", page);
            params.append("size", size);

            const res = await axios.get(
                `http://localhost:8081/api/discounts/search?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDiscounts(res.data.content);
            setTotalPages(res.data.totalPages);
            setIsSearching(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = () => {
        setCode("");
        setValue("");
        setPage(0);
        fetchData();
    };
    const closeCreateModal = () => {
        setShowCreateModal(false);
        setCreateForm({ code: "", value: "", status: true });
        setCreateErrors({ code: "", value: "" });
    };



    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        isSearching ? handleSearch() : fetchData();
    }, [page]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);
    const openDeleteModal = (id) => {
        setSelectedDiscountId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/discounts/${selectedDiscountId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success("✅ Đã xóa mã giảm giá thành công!");
                fetchData(); // ✅ Gọi lại để tải danh sách mới
            } else {
                const msg = await response.text();
                toast.warn("⚠️ " + msg);
            }
        } catch (error) {
            toast.error("❌ Có lỗi xảy ra khi xóa!");
        } finally {
            setShowDeleteModal(false);
            setSelectedDiscountId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded-xl">
            <h2 className={styles1.headerTextt}>Danh sách mã giảm giá</h2>

            <div className={styles1.searchContainer1}>
                <input
                    type="text"
                    value={code}
                    className={styles1.searchInput1}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Tìm theo mã"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Tìm theo giá trị"
                    className={styles1.searchInput1}
                />
                <button className={styles1.searchButton1} onClick={handleSearch}>
                    <span className={styles1.iconSearch1}><BiSearch/></span> Tìm kiếm
                </button>
            </div>
            <button onClick={openCreateModal}
                    className={styles.addProductButton11}>
                <i className={`fas fa-plus-circle ${styles.addIcon11}`}></i> Thêm mới khuyến mãi
            </button>
            <div className={styles1.tableWrappertb}>

                <table className={styles1.tablet}>
                    <thead>
                    <tr>
                        <th >STT</th>
                        <th>Code</th>
                        <th >Value (%)</th>
                        <th >Status</th>
                        <th>Tác vụ</th>
                        {/* Thêm cột tác vụ */}

                    </tr>
                    </thead>
                    <tbody>
                    {discounts.map((d,index) => (
                        <tr key={d.id} >
                            <td >{page * size + index + 1}</td>
                            <td >{d.code}</td>
                            <td>{d.value}</td>
                            <td>{d.status ? "Đang hoạt động" : "Ngừng"}</td>
                            <td className={styles.actions11}>
                                <button
                                    className={styles.editButton11}
                                    onClick={() => handleEditClick(d)}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button
                                    className={styles.deleteButton11}
                                    onClick={() => openDeleteModal(d.id)}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showDeleteModal && (
                <div className={styles4.modalOverlayf}>
                    <div className={styles4.modalContentf}>
                        <h3>Xác nhận xoá</h3>
                        <p>Bạn có chắc muốn xóa mã giảm giá này?</p>
                        <div className={styles4.modalActionsf}>
                            <button onClick={handleConfirmDelete} className={`${styles4.btnf} ${styles4.btnDangerf}`}>
                                Xóa
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className={`${styles4.btnf} ${styles4.btnSecondaryf}`}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div className={styles1.paginationContainert}>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className={styles1.paginationButtont}                    >
                        Trước
                    </button>
                    <span className={styles1.pageInfot}>Trang {page + 1} / {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page + 1 >= totalPages}
                        className={styles1.paginationButtont}                    >
                        Sau
                    </button>
                </div>
            {showCreateModal && (
                <div className={styles3.overlayg}>
                    <div className={styles3.modalContainerg}>
                        <h2 className={styles3.modalTitleg}>Thêm mới mã giảm giá</h2>

                        <label className={styles3.labelg}>Code:</label>
                        <input
                            className={styles3.inputg}
                            value={createForm.code}
                            onChange={(e) => {
                                setCreateForm({ ...createForm, code: e.target.value });
                                setCreateErrors({ ...createErrors, code: "" });
                            }}
                        />
                        {createErrors.code && (
                            <p className={styles3.errorTextg}>{createErrors.code}</p>
                        )}

                        <label className={styles3.labelg}>Value (%):</label>
                        <input
                            type="number"
                            className={styles3.inputg}
                            value={createForm.value}
                            onChange={(e) => {
                                setCreateForm({ ...createForm, value: parseFloat(e.target.value) });
                                setCreateErrors({ ...createErrors, value: "" });
                            }}
                        />
                        {createErrors.value && (
                            <p className={styles3.errorTextg}>{createErrors.value}</p>
                        )}

                        <label className={styles3.labelg}>Status:</label>
                        <select
                            className={styles3.inputg}
                            value={createForm.status}
                            onChange={(e) =>
                                setCreateForm({ ...createForm, status: e.target.value === "true" })
                            }
                        >
                            <option value="true">Đang hoạt động</option>
                            <option value="false">Ngừng</option>
                        </select>

                        <div className={styles3.buttonGroupg}>
                            <button
                                onClick={closeCreateModal}
                                className={styles3.cancelButtong}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreate}
                                className={styles3.createButtong}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className={styles2.overlayh}>
                    <div className={styles2.modalContainerh}>
                        <h2 className={styles2.modalTitleh}>Cập nhật mã giảm giá</h2>

                        <label className={styles2.labelh}>Code:</label>
                        <input
                            className={styles2.inputh}
                            value={formData.code}
                            onChange={(e) => {
                                setFormData({ ...formData, code: e.target.value });
                                setErrors({ ...errors, code: "" });
                            }}
                        />
                        {errors.code && (
                            <p className={styles2.errorTexth}>{errors.code}</p>
                        )}

                        <label className={styles2.labelh}>Value (%):</label>
                        <input
                            type="number"
                            className={styles2.inputh}
                            value={formData.value}
                            onChange={(e) => {
                                setFormData({ ...formData, value: e.target.value });
                                setErrors({ ...errors, value: "" });
                            }}
                        />
                        {errors.value && (
                            <p className={styles2.errorTexth}>{errors.value}</p>
                        )}

                        <label className={styles2.labelh}>Status:</label>
                        <select
                            className={styles2.inputh}
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value === "true" })
                            }
                        >
                            <option value="true">Đang hoạt động</option>
                            <option value="false">Ngừng</option>
                        </select>

                        <div className={styles2.buttonGrouph}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className={styles2.cancelButtonh}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                className={styles2.updateButtonh}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </div>
            );
            };

            export default DiscountList;

            // <button onClick={handleReset} className="bg-gray-400 text-white px-4 py-2 rounded">Tất cả</button>
