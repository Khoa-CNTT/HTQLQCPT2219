import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Css/ToppingIngredientList.module.css';
import {toast} from "react-toastify";
import Modal from 'react-modal';
// Modal.setAppElement('#root');

const ToppingIngredientList = () => {
    const [data, setData] = useState([]);
    const [token] = useState(localStorage.getItem('token'));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [editTopping, setEditTopping] = useState(null); // sản phẩm đang sửa
    const [editIngredients, setEditIngredients] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [toppingIdToDelete, setToppingIdToDelete] = useState(null);
    const handleEdit = (topping) => {
        console.log("Product được chọn để sửa:", topping);
        setEditTopping(topping);
        setEditIngredients(topping.ingredients.map(i => ({ ...i })));
        setEditIngredientErrors(topping.ingredients.map(() => ({ name: '', amount: '' }))); // Reset lỗi theo số lượng nguyên liệu
        setErrorMessage('');
    };
    const [amountError, setAmountError] = useState('');

    const [showModal, setShowModal] = useState(false); // Trạng thái modal
    const [newIngredient, setNewIngredient] = useState({
        toppingName: '',
        ingredientName: '',
        amountRequired: '',
    });
    const [newToppingIngredient, setNewToppingIngredient] = useState({
        toppingName: '',
        ingredientName: '',
        amountRequired: '',
    });
    const [toppingFieldErrors, setToppingFieldErrors] = useState({
        toppingName: '',
        ingredientName: '',
    });
    const [toppingErrorMessage, setToppingErrorMessage] = useState('');

    const [editIngredientErrors, setEditIngredientErrors] = useState([]); // Mỗi phần tử tương ứng một dòng nguyên liệu

    const handleAddToppingIngredient = async () => {
        let hasError = false;

        // Validate toppingName
        if (!newToppingIngredient.toppingName || newToppingIngredient.toppingName.trim() === "") {
            setToppingFieldErrors((prev) => ({ ...prev, toppingName: "Tên topping không được để trống." }));
            hasError = true;
        } else {
            setToppingFieldErrors((prev) => ({ ...prev, toppingName: "" }));
        }

        // Validate ingredientName
        if (!newToppingIngredient.ingredientName || newToppingIngredient.ingredientName.trim() === "") {
            setToppingFieldErrors((prev) => ({ ...prev, ingredientName: "Tên nguyên liệu không được để trống." }));
            hasError = true;
        } else {
            setToppingFieldErrors((prev) => ({ ...prev, ingredientName: "" }));
        }

        // Validate amountRequired
        if (!newToppingIngredient.amountRequired || isNaN(newToppingIngredient.amountRequired)) {
            setAmountError("Định lượng phải là một số hợp lệ.");
            hasError = true;
        } else if (Number(newToppingIngredient.amountRequired) <= 0) {
            setAmountError("Định lượng phải lớn hơn 0.");
            hasError = true;
        } else {
            setAmountError('');
        }

        if (hasError) return;

        try {
            console.log("Data gửi lên:", newToppingIngredient);

            const response = await axios.post(
                'http://localhost:8081/api/topping-ingredients/add',
                newToppingIngredient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Thêm nguyên liệu vào topping thành công!");
            handleCloseToppingModal();
            fetchData();

            // Reset lỗi
            setToppingFieldErrors({
                toppingName: '',
                ingredientName: '',
            });
            setAmountError('');
            setToppingErrorMessage('');
        } catch (error) {
            console.error('Lỗi khi thêm nguyên liệu cho topping:', error);
            const errorMsg = error.response?.data;

            if (errorMsg.includes("topping")) {
                setToppingFieldErrors((prev) => ({
                    ...prev,
                    toppingName: errorMsg
                }));
            } else if (errorMsg.includes("nguyên liệu")) {
                setToppingFieldErrors((prev) => ({
                    ...prev,
                    ingredientName: errorMsg
                }));
            } else {
                setToppingErrorMessage(errorMsg || 'Đã xảy ra lỗi không xác định.');
            }
        }
    };


    const handleCloseToppingModal = () => {
        setShowModal(false); // hoặc setShowToppingModal nếu có modal riêng
        setNewToppingIngredient({
            toppingName: '',
            ingredientName: '',
            amountRequired: '',
        });
        setToppingFieldErrors({
            toppingName: '',
            ingredientName: '',

        });
        setToppingErrorMessage('');
        setAmountError('');

    };




    const handleIngredientChange = (index, field, value) => {
        const updated = [...editIngredients];
        updated[index][field] = value;
        setEditIngredients(updated);

        // Xóa lỗi tương ứng
        const updatedErrors = [...editIngredientErrors];
        updatedErrors[index][field] = '';
        setEditIngredientErrors(updatedErrors);
    };


    const handleSave = async () => {
        const newErrors = editIngredients.map((ingredient) => ({ name: '', amount: '' }));
        let hasError = false;

        editIngredients.forEach((ingredient, index) => {
            // Kiểm tra name
            if (!ingredient.name.trim()) {
                newErrors[index].name = "Tên nguyên liệu không được để trống.";
                hasError = true;
            }

            // Kiểm tra amount
            if (
                ingredient.amount === '' || // rỗng
                isNaN(ingredient.amount) || // không phải số
                Number(ingredient.amount) <= 0 // số <= 0
            ) {
                newErrors[index].amount = "Định lượng phải là số và lớn hơn 0.";
                hasError = true;
            }
        });

        if (hasError) {
            setEditIngredientErrors(newErrors);
            toast.warning("Vui lòng kiểm tra lại các trường.");
            return;
        }

        try {
            const payload = {
                id: editTopping.id,
                ingredients: editIngredients.map(i => ({
                    name: i.name.trim(),
                    amount: i.amount,
                }))
            };

            const response = await axios.put(
                `http://localhost:8081/api/topping-ingredients/update/${editTopping.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            fetchData();
            setEditTopping(null);
            toast.success("Cập nhật nguyên liệu thành công!");
        } catch (error) {
            const msg = error.response?.data;

            if (msg && typeof msg === 'string') {
                const errorList = msg.split('||');
                const newErrors = editIngredients.map(ingredient => ({ name: '', amount: '' }));

                errorList.forEach(err => {
                    editIngredients.forEach((ingredient, index) => {
                        if (err.includes(ingredient.name)) {
                            newErrors[index].name = err;
                        }
                    });
                });

                setEditIngredientErrors(newErrors);
            } else {
                setErrorMessage("Có lỗi xảy ra khi cập nhật.");
                toast.error("Có lỗi xảy ra khi cập nhật.");
            }
        }
    };





    const handleCancel = () => {
        setEditTopping(null);
        setErrorMessage('');
    };
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/topping-ingredients/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("DATA:", response.data); // 👈 kiểm tra ở đây

            setData(response.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    // Reset dữ liệu form khi đóng modal
    const handleCloseModal = () => {
        setShowModal(false);

        setNewIngredient({
            toppingName: '',
            ingredientName: '',
            amountRequired: '',

        });
        setFieldErrors({
            toppingName: '',
            ingredientName: '',
        });
        setErrorMessage('');
        setAmountError('');

    };
    const handleDeleteIngredient = async (id, ingredientName) => {
        try {
            console.log('Xóa toppingId:', toppingIdToDelete);
            console.log('Xóa ingredient:', ingredientToDelete);

            const response = await axios.delete(
                `http://localhost:8081/api/topping-ingredients/delete`,
                {
                    params: {
                        toppingId: id,  // Đảm bảo truyền đúng productId (kiểu Long)
                        ingredientName: ingredientName,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            toast.success('Xoá nguyên liệu thành công!');
            fetchData(); // Load lại danh sách sau khi xoá
            setIsModalOpen(false); // Đóng modal sau khi xóa thành công
        } catch (error) {
            console.error('Lỗi khi xoá nguyên liệu:', error);
            toast.error('Xoá nguyên liệu thất bại!');
        }
    };
    const handleOpenModal = () => {
        setNewToppingIngredient({
            toppingName: '',
            ingredientName: '',
            amountRequired: '',
        });
        setToppingFieldErrors({
            toppingName: '',
            ingredientName: '',
        });
        setToppingErrorMessage('');
        setShowModal(true);
    };

    const openModal = (id, ingredientName) => {
        console.log(">>> GỌI MODAL VỚI:", id, ingredientName); // log ở đây
        setToppingIdToDelete(id);
        setIngredientToDelete(ingredientName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIngredientToDelete(null);
        setToppingIdToDelete(null);
    };




    useEffect(() => {
        fetchData();
    }, []);
    const [fieldErrors, setFieldErrors] = useState({
        productName: '',
        ingredientName: '',
    });

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    const handleDeleteProduct = async (toppingId) => {
        try {
            await axios.delete(`http://localhost:8081/api/topping-ingredients/delete-product/${toppingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Đã xoá sản phẩm và nguyên liệu!');
            fetchData();
        } catch (error) {
            toast.error('Lỗi khi xoá sản phẩm!');
            console.error(error);
        }
    };


    return (
        <div className={styles.containerk}>
            <h2 className={styles.titlek}>Quản lý nguyên liệu phụ</h2>
            <button onClick={handleOpenModal}   className={styles.addProductButton111}>
                <i   className={`fas fa-plus-circle ${styles.addIcon111}`}></i> Thêm mới
            </button>
            {currentData.map((topping, index) => (
                <div key={index} className={styles.productBlockk}>
                    <h3 className={styles.productNamek}>{topping.name}</h3>

                    <ul className={styles.ingredientsListk}>
                        {topping.ingredients.map((ingredient, idx) => (
                            <li key={idx} className={styles.ingredientItemk}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>
                    <strong>Nguyên liệu:</strong> {ingredient.name} – <strong>Định lượng cần:</strong> {ingredient.amount}
                </span>
                                    <button
                                        onClick={() => openModal(topping.id, ingredient.name)} // Gọi modal khi nhấn xóa
                                        className={styles.deleteIngredientButtonk}
                                    >
                                        ❌
                                    </button>

                                </div>
                            </li>
                        ))}
                    </ul>


                    <div className={styles.buttonGroupk}>
                        <button
                            onClick={() => handleEdit(topping)}
                            className={styles.editButtonk}
                        >
                            Chỉnh sửa
                        </button>
                        {/*<button*/}
                        {/*    onClick={() => handleDeleteProduct(product.productId)}*/}
                        {/*    className={styles.deleteButtonk}*/}
                        {/*>*/}
                        {/*    Xoá*/}
                        {/*</button>*/}

                    </div>
                </div>
            ))}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Xác nhận xóa nguyên liệu"
                className={styles.modalv}
                overlayClassName={styles.overlayv}
            >
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa nguyên liệu "{ingredientToDelete}" khỏi sản phẩm không?</p>
                <div>
                    <button onClick={closeModal} className={styles.cancelButtonv}>Hủy</button>
                    <button
                        onClick={() => {
                            handleDeleteIngredient(toppingIdToDelete, ingredientToDelete);
                        }}
                        className={styles.confirmButtonv}
                    >
                        Xóa
                    </button>
                </div>
            </Modal>
            <div className={styles.paginationk}>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={styles.pageButtonk}
                >
                    Trước
                </button>

                <span className={styles.pageInfok}>
          Trang {currentPage} / {totalPages}
        </span>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={styles.pageButtonk}
                >
                    Sau
                </button>
            </div>
            {showModal && (
                <div className={styles.modalcr}>
                    <div className={styles.modalContentcr}>
                        {/*<span className={styles.closecr} onClick={() => setShowModal(false)}>&times;</span>*/}
                        <h3 style={{
                            color: '#6b4c3b',        // Nâu cà phê sang
                            fontFamily: `'Segoe UI', 'Georgia', serif`, // chữ mềm mại, thanh lịch
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '20px',
                            textAlign: 'center',
                            letterSpacing: '0.5px'
                        }}>
                            Thêm Nguyên Liệu Phụ
                        </h3>
                        {errorMessage && <p className={styles.errorcr}>{errorMessage}</p>}
                        <div>
                            <label>Tên topping</label>
                            <input
                                type="text"
                                value={newToppingIngredient.toppingName}
                                onChange={(e) =>
                                    setNewToppingIngredient({ ...newToppingIngredient, toppingName: e.target.value })
                                }
                            />
                            {toppingFieldErrors.toppingName && <p className={styles.errorcr}>{toppingFieldErrors.toppingName}</p>}
                        </div>

                        <div>
                            <label>Tên Nguyên Liệu</label>
                            <input
                                type="text"
                                value={newToppingIngredient.ingredientName}
                                onChange={(e) =>
                                    setNewToppingIngredient({ ...newToppingIngredient, ingredientName: e.target.value })
                                }
                            />
                            {toppingFieldErrors.ingredientName && <p className={styles.errorcr}>{toppingFieldErrors.ingredientName}</p>}
                        </div>

                        <div>
                            <label>Định Lượng</label>
                            <input
                                type="number"
                                value={newToppingIngredient.amountRequired}
                                onChange={(e) =>
                                    setNewToppingIngredient({
                                        ...newToppingIngredient,
                                        amountRequired: e.target.value
                                    })
                                }
                            />
                            {amountError && <p className={styles.errorcr}>{amountError}</p>}
                        </div>
                        <button className={styles.buttoncr} onClick={handleAddToppingIngredient}>Thêm mới</button>
                        <button className={styles.buttoncr} onClick={handleCloseModal}>Hủy</button>

                    </div>
                </div>
            )}
            {editTopping && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>

                            <h3>Chỉnh sửa nguyên liệu phụ cho sản phẩm: <em>{editTopping.name}</em></h3>

                            {editIngredients.map((ingredient, index) => (
                                <div key={index} className={styles.inputGroup}>
                                    <label>Nguyên liệu:</label>
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    />
                                    {editIngredientErrors[index]?.name && (
                                        <div className={styles.error}>{editIngredientErrors[index].name}</div>
                                    )}
                                    <label>Định lượng:</label>
                                    <input
                                        type="number"
                                        value={ingredient.amount}
                                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                    />
                                    {editIngredientErrors[index]?.amount && (
                                        <div className={styles.error}>{editIngredientErrors[index].amount}</div>
                                    )}

                                </div>
                            ))}
                        </div>
                        <div className={styles.modalButtons}>
                            <button onClick={handleSave} className={styles.saveButtonk}>Lưu</button>
                            <button onClick={handleCancel} className={styles.cancelButtonk}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ToppingIngredientList;
