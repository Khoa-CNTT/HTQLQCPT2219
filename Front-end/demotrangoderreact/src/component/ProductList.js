import React, {useEffect, useState} from "react";
import styles from "../Css/ProductList.module.css";
import {fetchProducts} from "../service/ProductService";
import { storage } from "../config/firebaseConfig"; // Đảm bảo bạn đã cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {toast} from "react-toastify";
import {BiSearch} from "react-icons/bi";
import * as productName from "prettier";
import * as productCode from "prettier";
import axios from "axios"; // Import các hàm từ Firebase
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái modalte;
    const [searchCode, setSearchCode] = useState('');
    const [searchName, setSearchName] = useState('');
    const itemsPerPage = 4;

    const [newProduct, setNewProduct] = useState({
        productCode: "",
        productImgUrl: "",
        productName: "",
        productPrice: "",
        category: { categoryId: "" }
    });
    const handleOpenModal = async () => {
        await loadAllProducts(); // Load toàn bộ dữ liệu
        setModalVisible(true);   // Mở modal sau
    };


    const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
    const [url, setUrl] = useState(""); // Lưu URL ảnh đã upload
    const [editModalVisible, setEditModalVisible] = useState(false); // Modal cập nhật
    const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
    const handleEditClick = async (productId) => {
        try {
            await loadAllProducts(); // <- Load toàn bộ sản phẩm trước
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/product/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Không tìm thấy sản phẩm");

            const productData = await response.json();
            setEditingProduct(productData);
            setUrl(productData.productImgUrl);
            setEditModalVisible(true);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm theo ID:", error);
        }
    };


    // Hàm tải danh sách danh mục từ API
    const loadCategories = async () => {
        try {
            const response = await fetch("http://localhost:8081/api/category");
            const data = await response.json();
            console.log(data); // vẫn giữ để debug thêm nếu cần
            setCategories(data.content); // 💥 CHỈ LẤY MẢNG NÀY
            setProducts(data.content); // Lưu danh sách sản phẩm vào state
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        const code = newProduct.productCode?.trim().toLowerCase();
        const name = newProduct.productName?.trim().toLowerCase();

        if (!code) {
            newErrors.productCode = "Mã sản phẩm không được để trống";
        } else if (!/^SP\d{2}$/.test(newProduct.productCode)) {
            newErrors.productCode = "Mã sản phẩm phải có định dạng SPXX, trong đó XX là 2 chữ số";
        } else if (allProducts.some(p => p.productCode?.trim().toLowerCase() === code)) {
            newErrors.productCode = "Mã sản phẩm đã tồn tại";
        }

        if (!name) {
            newErrors.productName = "Tên sản phẩm không được để trống";
        } else if (allProducts.some(p => p.productName?.trim().toLowerCase() === name)) {
            newErrors.productName = "Tên sản phẩm đã tồn tại";
        }

        // Giá
        if (!newProduct.productPrice || Number(newProduct.productPrice) <= 0) {
            newErrors.productPrice = "Giá phải lớn hơn 0";
        }

        // Danh mục
        if (!newProduct.category.categoryId) {
            newErrors.category = "Vui lòng chọn danh mục";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateEditingProduct = () => {
        const errors = {};

        const code = editingProduct.productCode?.trim().toLowerCase();
        const name = editingProduct.productName?.trim().toLowerCase();

        // Validate mã sản phẩm
        if (!code) {
            errors.productCode = "Mã sản phẩm không được để trống";
        } else if (!/^SP\d{2}$/.test(editingProduct.productCode)) {
            errors.productCode = "Mã sản phẩm phải có định dạng SPXX, trong đó XX là 2 chữ số";
        } else if (
            allProducts.some(
                (p) => {
                    console.log("ID so sánh:", typeof p.productId, p.productId, typeof editingProduct.productId, editingProduct.productId);
                    return Number(p.productId) !== Number(editingProduct.productId) &&
                        p.productCode?.trim().toLowerCase() === code;
                }
            )

        ) {
            errors.productCode = "Mã sản phẩm đã tồn tại";
        }

        // Validate tên sản phẩm
        if (!name) {
            errors.productName = "Tên sản phẩm không được để trống";
        } else if (
            allProducts.some(
                (p) =>
                    Number(p.productId) !== Number(editingProduct.productId) &&
                    p.productName?.trim().toLowerCase() === name
            )
        ) {
            errors.productName = "Tên sản phẩm đã tồn tại";
        }

        // Validate giá
        if (!editingProduct.productPrice || Number(editingProduct.productPrice) <= 0) {
            errors.productPrice = "Giá phải lớn hơn 0";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };




    useEffect(() => {
        loadProducts(); // Gọi hàm tải sản phẩm ngay khi component render
    }, []);


    useEffect(() => {
        loadCategories(); // Tải danh mục khi component mount
    }, []);
        // Hàm xử lý thay đổi giá trị trong form modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "category.categoryId") {
            setNewProduct(prev => ({
                ...prev,
                category: {
                    ...prev.category,
                    categoryId: value === "" ? "" : Number(value)
                }
            }));
        } else {
            setNewProduct(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // ❌ KHÔNG validate ở đây nữa
    };

    const handleCancelEdit = () => {
        // setEditingTable(originalTable); // ← Reset lại form
        setErrors({});                  // ← Reset validate lỗi
        setEditModalVisible(false);     // ← Đóng modal
    };

    // Hàm upload ảnh lên Firebase
    const handleUpload = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref); // <-- Sửa ở đây
            setNewProduct((prevProduct) => ({
                ...prevProduct,
                productImgUrl: downloadURL
            }));
            setUrl(downloadURL);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
    const handleUploadForEdit = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Cập nhật ảnh mới vào editingProduct
            setEditingProduct((prevProduct) => ({
                ...prevProduct,
                productImgUrl: downloadURL,
            }));
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // Hàm xử lý thay đổi file hình ảnh
    const handleImageChange = (event) => {
        const file = event.target.files[0];  // Lấy file được chọn
        if (file) {
            // Tạo URL tạm thời cho ảnh hiển thị
            const imageUrl = URL.createObjectURL(file);
            setUrl(imageUrl);

            // Lưu file vào state nếu cần thiết
            setNewProduct((prevProduct) => ({
                ...prevProduct,
                productImage: file
            }));

            // Gọi hàm upload lên Firebase
            handleUpload(file);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null); // chứa thông tin sản phẩm được chọn xoá
    const confirmDelete = (product) => {
        setProductToDelete(product);   // Lưu sản phẩm đang chọn xoá
        setShowDeleteModal(true);      // Hiện modal
    };
    const handleDeleteConfirmed = async () => {
        if (!productToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8081/api/product/${productToDelete.productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                toast.success(" Đã xoá sản phẩm thành công!");
                setShowDeleteModal(false);
                setProductToDelete(null);
                handleSearch(); // Hoặc loadProducts(currentPage)
            } else {
                toast.error(" Xoá thất bại!");
            }
        } catch (error) {
            console.error("Lỗi xoá sản phẩm:", error);
            toast.error("⚠️ Có lỗi xảy ra khi xoá.");
        }
    };

    // Hàm xử lý thêm sản phẩm mới
    const handleAddProduct = async () => {
        const token = localStorage.getItem("token");

        // ✅ Gọi validate tại đây
        const isValid = validateForm();
        if (!isValid) return;

        if (!newProduct.productImage) {
            toast.error("Vui lòng chọn ảnh cho sản phẩm");
            return;
        }

        try {
            if (!newProduct.category.categoryId) {
                alert("Vui lòng chọn danh mục sản phẩm.");
                return;
            }

            const response = await fetch("http://localhost:8081/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const savedProduct = await response.json();
                setProducts(prev => [savedProduct, ...prev]);
                setModalVisible(false);
                toast.success("Thêm mới thành công");
            } else {
                console.error("Lỗi khi thêm sản phẩm");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm sản phẩm:", error);
        }
    };
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const handleSearch = () => {
        loadProducts(0); // Reset về trang đầu khi tìm kiếm
    };

    const loadProducts = async (page = 0) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get("http://localhost:8081/api/product/searchByNameAndCode", {
                params: {
                    productName: productName.trim() || null,
                    productCode: productCode.trim() || null,
                    page: page,
                    size: 4,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    };


    const [allProducts, setAllProducts] = useState([]);

    const loadAllProducts = async () => {
        try {
            const data = await fetchProducts(); // Gọi API không phân trang
            console.log("Dữ liệu trả về từ fetchProducts:", data); // 👉 Log ở đây
            setAllProducts(data.content); // Không cần phân trang, lưu thẳng
        } catch (error) {
            console.error("Lỗi khi tải tất cả sản phẩm:", error);
        }
    };


    useEffect(() => {
        loadProducts();
    }, []);

    const handlePageChange = (newPage) => {
        loadProducts(newPage);
    };



// Hàm reset dữ liệu trong modal
    const resetModalData = () => {
        setNewProduct({
            productCode: '',
            productName: '',
            productPrice: '',
            category: { categoryId: '' },
            productImg: '',
        });
        setErrors({});
        setUrl('');
    };

// Khi đóng modal, gọi hàm reset
    useEffect(() => {
        if (!modalVisible) {
            resetModalData();
        }
    }, [modalVisible]);
    const updateProduct = async () => {
        const token = localStorage.getItem("token");
        if (!validateEditingProduct()) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product/${editingProduct.productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editingProduct)
            });

            if (response.ok) {
                toast.success("Cập nhật sản phẩm thành công");
                setEditModalVisible(false); // đóng modal
                loadProducts(); // tải lại danh sách sản phẩm
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Đã có lỗi xảy ra khi cập nhật sản phẩm");
        }
    };

    return (
        <div className={styles.productListContainert}>
            <h2 className={styles.headerTextt}>Danh sách sản phẩm</h2>
            {/* Tìm kiếm */}
            <div className={styles.searchContainer1}>
                <input
                    type="text"
                    className={styles.searchInput1}
                    placeholder="Mã sản phẩm"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                />
                <input
                    type="text"
                    className={styles.searchInput1}
                    placeholder="Tên sản phẩm"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <button className={styles.searchButton1} onClick={handleSearch}>
                    <span className={styles.iconSearch1}><BiSearch/></span> Tìm kiếm
                </button>
            </div>


            <button onClick={handleOpenModal} className={styles.addProductButton1}>
                <i className={`fas fa-plus-circle ${styles.addIcon1}`}></i> Thêm mới sản phẩm
            </button>
            <div className={styles.tableWrappertb}>

                <table className={styles.tablet}>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Hình ảnh</th>
                        <th>Danh mục</th>
                        <th>Tác vụ</th>
                        {/* Cột Tác vụ */}
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product, index) => (
                        <tr key={product.productId}>
                            <td>{currentPage * 4 + index + 1}</td>
                            {/* STT chính xác theo từng trang */}
                            <td>{product.productCode}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }}>
                                {product.productName}
                            </td>
                            <td>{product.productPrice?.toLocaleString('vi-VN')} VND</td>
                            <td>
                                <img
                                    src={product.productImgUrl}
                                    alt={product.productName}
                                    className={styles.imaget}
                                />
                            </td>
                            <td>{product.category?.categoryName}</td>
                            <td className={styles.actions1}>
                                <button
                                    className={styles.editButton1}
                                    onClick={() => handleEditClick(product.productId)}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                                <button
                                    className={styles.deleteButton1}
                                    onClick={() => confirmDelete(product)}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showDeleteModal && productToDelete && (
                <div className={styles.modalOverladd}>
                    <div className={styles.modalContentdd}>
                        <h3>Xác nhận xoá</h3>
                        <p>Bạn có muốn xoá sản phẩm có mã: <strong>{productToDelete.productCode}</strong> không?</p>
                        <div className={styles.modalButtonsdd}>
                            <button onClick={handleDeleteConfirmed} className={styles.confirmBtndd}>Xoá</button>
                            <button onClick={() => setShowDeleteModal(false)} className={styles.cancelBtndd}>Huỷ</button>
                        </div>
                    </div>
                </div>
            )}

            {editModalVisible && editingProduct && (
                <div className={styles.modalOverlayt1}>
                    <div className={styles.modalt1}>
                        <h2>Cập nhật sản phẩm</h2>
                        <label>Mã sản phẩm</label>
                        <input
                            type="text"
                            value={editingProduct.productCode}
                            onChange={(e) => setEditingProduct({...editingProduct, productCode: e.target.value})}
                        />
                        {errors.productCode && <p className={styles.errorTextyy}>{errors.productCode}</p>}


                        <label>Tên sản phẩm</label>
                        <input
                            type="text"
                            value={editingProduct.productName}
                            onChange={(e) => setEditingProduct({...editingProduct, productName: e.target.value})}
                        />
                        {errors.productName && <p className={styles.errorTextyy}>{errors.productName}</p>}

                        <label>Giá sản phẩm</label>
                        <input
                            type="number"
                            value={editingProduct.productPrice}
                            onChange={(e) => setEditingProduct({...editingProduct, productPrice: e.target.value})}
                        />
                        {errors.productPrice && <p className={styles.errorTextyy}>{errors.productPrice}</p>}

                        <label>Danh mục</label>
                        <select
                            value={editingProduct.category.categoryId}
                            onChange={(e) =>
                                setEditingProduct({
                                    ...editingProduct,
                                    category: {categoryId: e.target.value},
                                })
                            }
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>

                        <label>Hình ảnh</label>
                        {/* Hiển thị ảnh hiện tại */}
                        {editingProduct.productImgUrl && (
                            <img
                                src={editingProduct.productImgUrl}
                                alt="Preview"
                                className={styles.uploadedImagey}
                            />
                        )}

                        {/* Input để chọn ảnh mới */}
                        <div className={styles.customFileUploady}>
                            <label htmlFor="file-upload" className={styles.uploadBtny}>
                                <i className={`fa fa-camera ${styles.iconyy}`}></i> Chọn ảnh
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleUploadForEdit(file);
                                    }
                                }}
                            />
                        </div>


                        <div className={styles.buttonRowt1}>
                            <button onClick={handleCancelEdit}>Hủy</button>
                            <button onClick={updateProduct}>Lưu thay đổi</button>

                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className={styles.paginationContainert}>
                {/* Nút "Trước" */}
                <button
                    className={styles.paginationButtont}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0} // Disable nếu đang ở trang đầu
                >
                    Trước
                </button>

                {/* Hiển thị thông tin trang */}
                <span className={styles.pageInfot}>
                    Trang {currentPage + 1}/{totalPages}
                </span>

                {/* Nút "Sau" */}
                <button
                    className={styles.paginationButtont}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1} // Disable nếu đang ở trang cuối
                >
                    Sau
                </button>
            </div>
            {/* Modal thêm sản phẩm */}
            {modalVisible && (
                <div className={styles.modaly}>
                    <div className={styles.modalContenty}>
                        <h3>Thêm mới sản phẩm</h3>
                        <label>Mã sản phẩm</label>
                        <input
                            type="text"
                            name="productCode"
                            value={newProduct.productCode}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                            className={styles.searchInputy}
                        />
                        {errors.productCode && <p className={styles.errorTexty}>{errors.productCode}</p>}
                        <label>Tên sản phẩm</label>
                        <input
                            type="text"
                            name="productName"
                            value={newProduct.productName}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                            className={styles.searchInputy}
                        />
                        {errors.productName && <p className={styles.errorTexty}>{errors.productName}</p>}
                        <label>Hình ảnh</label>
                        <div className={styles.uploadWrappery}>
                            <label htmlFor="imageUpload" className={styles.uploadLabely}>
                                📷 Tải ảnh lên
                            </label>
                            <input
                                id="imageUpload"
                                type="file"
                                onChange={handleImageChange}
                                className={styles.hiddenFileInput}
                                // onBlur={validateForm}
                            />
                        </div>
                        {url && <img src={url} alt="Uploaded" className={styles.uploadedImagey}/>}
                        {/*{errors.productImg && <p className={styles.errorTexty}>{errors.productImg}</p>}*/}

                        <label>Giá</label>
                        <input
                            type="number"
                            name="productPrice"
                            value={newProduct.productPrice}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                            className={styles.searchInputy}
                        />
                        {errors.productPrice && <p className={styles.errorTexty}>{errors.productPrice}</p>}
                        <label>Danh mục</label>
                        <select
                            name="category.categoryId"
                            value={newProduct.category.categoryId}
                            onChange={handleInputChange}
                            className={styles.searchInputy}
                            onBlur={validateForm}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className={styles.errorTexty}>{errors.category}</p>}


                        <div className={styles.modalActiony}>
                            <button onClick={handleAddProduct} className={styles.searchButtony}>Thêm</button>
                            <button onClick={() => setModalVisible(false)} className={styles.cancelButtony}>Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
