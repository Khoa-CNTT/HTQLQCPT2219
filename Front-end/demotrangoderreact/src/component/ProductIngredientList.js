import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Css/ProductIngredientList.module.css';
import {toast} from "react-toastify";
import Modal from 'react-modal';
// Modal.setAppElement('#root');

const ProductIngredientList = () => {
    const [data, setData] = useState([]);
    const [token] = useState(localStorage.getItem('token'));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const [editProduct, setEditProduct] = useState(null); // sản phẩm đang sửa
    const [editIngredients, setEditIngredients] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const handleEdit = (product) => {
        console.log("Product được chọn để sửa:", product);
        setEditProduct(product);
        setEditIngredients(product.ingredients.map(i => ({ ...i })));
        setEditIngredientErrors(product.ingredients.map(() => ({ name: '', amount: '' }))); // Reset lỗi theo số lượng nguyên liệu
        setErrorMessage('');
    };

    const [showModal, setShowModal] = useState(false); // Trạng thái modal
    const [newIngredient, setNewIngredient] = useState({
        productName: '',
        ingredientName: '',
        amountRequired: '',
    });
    const [editIngredientErrors, setEditIngredientErrors] = useState([]); // Mỗi phần tử tương ứng một dòng nguyên liệu

    // Hàm gửi yêu cầu thêm mới
    const handleAddProductIngredient = async () => {
        let hasError = false;

        // Validate amountRequired
        if (!newIngredient.amountRequired || isNaN(newIngredient.amountRequired)) {
            setAmountError("Định lượng phải là số hợp lệ.");
            hasError = true;
        } else if (Number(newIngredient.amountRequired) <= 0) {
            setAmountError("Định lượng phải lớn hơn 0.");
            hasError = true;
        } else {
            setAmountError('');
        }

        // Nếu có lỗi thì không gửi request
        if (hasError) return;

        try {
            const response = await axios.post(
                'http://localhost:8081/api/product-ingredients/add',
                newIngredient,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Thêm nguyên liệu thành công!");
            handleCloseModal();  // Đóng modal và reset form
            fetchData();         // Load lại danh sách
            setFieldErrors({     // Reset lỗi nếu có
                productName: '',
                ingredientName: '',
            });
            setAmountError('');
        } catch (error) {
            console.error('Lỗi khi thêm nguyên liệu:', error);
            const errorMsg = error.response?.data;

            if (errorMsg.includes("sản phẩm")) {
                setFieldErrors({
                    ...fieldErrors,
                    productName: errorMsg
                });
            } else if (errorMsg.includes("nguyên liệu")) {
                setFieldErrors({
                    ...fieldErrors,
                    ingredientName: errorMsg
                });
            } else {
                setErrorMessage(errorMsg || 'Đã xảy ra lỗi không xác định.');
            }
        }
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
                productId: editProduct.productId,
                ingredients: editIngredients.map(i => ({
                    name: i.name.trim(),
                    amount: i.amount,
                }))
            };

            const response = await axios.put(
                `http://localhost:8081/api/product-ingredients/update/${editProduct.productId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            fetchData();
            setEditProduct(null);
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
        setEditProduct(null);
        setErrorMessage('');
    };
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/product-ingredients/all', {
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
            productName: '',
            ingredientName: '',
            amountRequired: '',
        });
        setFieldErrors({
            productName: '',
            ingredientName: '',
        });
        setErrorMessage('');
        setAmountError('');

    };
    const handleDeleteIngredient = async (productId, ingredientName) => {
        try {
            const response = await axios.delete(
                `http://localhost:8081/api/product-ingredients/delete`,
                {
                    params: {
                        productId: productId,  // Đảm bảo truyền đúng productId (kiểu Long)
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
    const openModal = (productId, ingredientName) => {
        setProductIdToDelete(productId);
        setIngredientToDelete(ingredientName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIngredientToDelete(null);
        setProductIdToDelete(null);
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


    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8081/api/product-ingredients/delete-product/${productId}`, {
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

    const [amountError, setAmountError] = useState('');

    return (
        <div className={styles.containerk}>
            <h2 className={styles.titlek}>Quản lý nguyên liệu sản phẩm</h2>
            <button onClick={() => setShowModal(true)}  className={styles.addProductButton111}>
                <i   className={`fas fa-plus-circle ${styles.addIcon111}`}></i> Thêm mới
            </button>
            {currentData.map((product, index) => (
                <div key={index} className={styles.productBlockk}>
                    <h3 className={styles.productNamek}>{product.productName}</h3>

                    <ul className={styles.ingredientsListk}>
                        {product.ingredients.map((ingredient, idx) => (
                            <li key={idx} className={styles.ingredientItemk}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>
                    <strong>Nguyên liệu:</strong> {ingredient.name} – <strong>Định lượng cần:</strong> {ingredient.amount}
                </span>
                                    <button
                                        onClick={() => openModal(product.productId, ingredient.name)} // Gọi modal khi nhấn xóa
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
                            onClick={() => handleEdit(product)}
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
                            handleDeleteIngredient(productIdToDelete, ingredientToDelete);
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
                            Thêm Nguyên Liệu Cho Sản Phẩm
                        </h3>
                        {errorMessage && <p className={styles.errorcr}>{errorMessage}</p>}
                        <div>
                            <label>Tên Sản Phẩm</label>
                            <input
                                type="text"
                                value={newIngredient.productName}
                                onChange={(e) => {
                                    setNewIngredient({...newIngredient, productName: e.target.value});
                                    setFieldErrors({...fieldErrors, productName: ''}); // clear lỗi khi gõ
                                }}
                            />
                            {fieldErrors.productName && <p className={styles.errorcr}>{fieldErrors.productName}</p>}
                        </div>

                        <div>
                            <label>Tên Nguyên Liệu</label>
                            <input
                                type="text"
                                value={newIngredient.ingredientName}
                                onChange={(e) => {
                                    setNewIngredient({...newIngredient, ingredientName: e.target.value});
                                    setFieldErrors({...fieldErrors, ingredientName: ''}); // clear lỗi khi gõ
                                }}
                            />
                            {fieldErrors.ingredientName && <p className={styles.errorcr}>{fieldErrors.ingredientName}</p>}
                        </div>

                        <div>
                            <label>Định Lượng</label>
                            <input
                                type="number"
                                value={newIngredient.amountRequired}
                                onChange={(e) => {
                                    setNewIngredient({...newIngredient, amountRequired: e.target.value});
                                    setAmountError('');
                                }}
                            />
                            {amountError && <p className={styles.errorcr}>{amountError}</p>}
                        </div>
                        <button className={styles.buttoncr} onClick={handleAddProductIngredient}>Thêm mới</button>
                        <button className={styles.buttoncr} onClick={handleCloseModal}>Hủy</button>

                    </div>
                </div>
            )}
            {editProduct && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>

                            <h3>Chỉnh sửa nguyên liệu cho sản phẩm: <em>{editProduct.productName}</em></h3>

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


            export default ProductIngredientList;
