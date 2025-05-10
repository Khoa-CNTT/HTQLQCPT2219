import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import Modal1 from 'react-modal';
import {v4 as uuidv4} from 'uuid';

import {getTableById} from '../service/TableService';
import {getAllCategories} from '../service/CategoryService';
import {getAllProduct, getProductsByCategory, searchProducts} from '../service/ProductService';
import {getAllSizes} from '../service/SizeService'; // Import API size
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css';
import styles from '../Css/TableDetails.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import stylesAddProductModal from '../Css/stylesAddProductModal.module.css';
import {getAllToppings} from "../service/toppingService";
import {Modal} from "antd";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faListAlt,
    faCoffee,
    faHamburger,
    faMugHot,
    faUtensils,
    faIceCream,
    faPizzaSlice, faSeedling
} from '@fortawesome/free-solid-svg-icons';
import {FaCreditCard, FaMoneyBillWave, FaStar, FaTimes} from "react-icons/fa";
import ChatBox from "./ChatBox";
import {fetchData} from "../service/UserService";
import TopSellingModal from "./TopSellingModal";

const TableDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [toppings, setToppings] = useState([]);
    const [selectedTopping, setSelectedTopping] = useState([]); // State để lưu các topping đã chọn
    const [categoryCodeSelected, setCategoryCodeSelected] = useState(null); // Trạng thái lưu mã danh mục được chọn
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [table, setTable] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // State cho danh sách sản phẩm được lọc
    const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTriggered, setSearchTriggered] = useState(false); // Kiểm soát trạng thái tìm kiếm
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Để quản lý modal
    const [selectedProduct, setSelectedProduct] = useState(null); // Để lưu thông tin sản phẩm được chọn
    const [selectedSize, setSelectedSize] = useState(''); // Để lưu size được chọn
    const [quantity, setQuantity] = useState(1); // Để lưu số lượng được chọn
    const [discountCode, setDiscountCode] = useState(''); // State lưu mã giảm giá
    const [discount, setDiscount] = useState(null); // State lưu thông tin mã giảm giá
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isPaginated, setIsPaginated] = useState(true); // Kiểm tra trạng thái phân trang
    const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [reviewerName, setReviewerName] = useState("");

    const [callOrderId, setCallOrderId] = useState(null); // Lưu ID đơn hàng để gửi feedback
    const [rating, setRating] = useState(0); // Đánh giá mặc định
    const [content, setContent] = useState(""); // Bình luận của khách hàng
    const [isChoiceModalVisible, setIsChoiceModalVisible] = useState(false);
    const handleServiceType = (type) => {
        const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
        const newRequest = { id, type };

        const exists = serviceRequests.some(req => req.id === id && req.type === type);

        if (!exists) {
            serviceRequests.push(newRequest);
            localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
            setModalContent(`Đã gửi yêu cầu "${type}" cho bàn ${id}`);
        } else {
            setModalContent(`Bàn ${id} đã gửi yêu cầu "${type}" trước đó.`);
        }

        setIsChoiceModalVisible(false);
        setIsModalVisible(true);
    };

    // const callForService = () => {
    //     const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    //     if (!serviceRequests.includes(id)) {
    //         serviceRequests.push(id);
    //         localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
    //         setModalContent(`Đã gửi yêu cầu gọi phục vụ cho bàn ${id}`);
    //     } else {
    //         setModalContent(`Bàn ${id} đã yêu cầu phục vụ trước đó.`);
    //     }
    //     setIsModalVisible(true); // Hiển thị modal
    // };
    const backHome=()=>{
        navigate("/home");
    }
    const openEditModal = (product) => {
        setEditingProduct(product); // Lưu sản phẩm đang chỉnh sửa vào state
        setSelectedSize(product.sizeId); // Đặt size hiện tại
        setQuantity(product.quantity); // Đặt số lượng hiện tại
        setSelectedToppings(product.toppings.map((topping) => topping.toppingId)); // Đặt topping hiện tại
    };
    const [showSuggestionText, setShowSuggestionText] = useState(false); // hiển thị chữ "Gợi ý món!"
    const [showModal, setShowModal] = useState(false); // hiển thị modal sản phẩm
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowSuggestionText(true);
            setTimeout(() => setShowSuggestionText(false), 3000); // chữ hiển thị 3s rồi ẩn
        }, 8000); // mỗi 8s hiện chữ 1 lần

        return () => clearInterval(interval);
    }, []);

    const handleSaveEdit = async () => {
        if (!selectedSize) {
            toast.error("Bạn cần chọn size cho sản phẩm!");
            return;
        }

        // Lấy thông tin size
        const selectedSizeData = sizes.find((size) => size.sizeId === Number(selectedSize));
        const productPrice = selectedSizeData
            ? editingProduct.productPrice + selectedSizeData.price
            : editingProduct.productPrice;
        const sizeName = selectedSizeData ? selectedSizeData.sizeName : "Không có size";

        // Tạo danh sách topping đã chọn
        const updatedToppings = selectedToppings.map((toppingId) => {
            const topping = toppings.find((t) => t.id === toppingId);
            return {
                toppingId: topping.id,
                toppingName: topping.name,
            };
        });

        // Tạo uniqueId cho sản phẩm đang chỉnh sửa sau khi thay đổi
        const generateUniqueId = (productId, sizeId, toppings) => {
            const toppingIds = toppings.map(t => t.toppingId).sort().join(',');
            return `${productId}_${sizeId}_${toppingIds}`;
        };
        const newUniqueId = generateUniqueId(editingProduct.productId, selectedSize, updatedToppings);

        // Tính tổng số lượng sản phẩm giống hệt (trừ sản phẩm đang chỉnh sửa)
        const totalOtherQuantity = selectedProducts
            .filter(p => generateUniqueId(p.productId, p.sizeId, p.toppings) === newUniqueId && p !== editingProduct)
            .reduce((acc, curr) => acc + curr.quantity, 0);

        const totalDesiredQuantity = totalOtherQuantity + parseInt(quantity, 10);

        // Gọi API kiểm tra nguyên liệu
        try {
            const response = await axios.post('http://localhost:8081/api/check/product-availability', {
                productId: editingProduct.productId,
                quantity: totalDesiredQuantity
            });

            if (response.data === "Sản phẩm không đủ nguyên liệu để làm.") {
                toast.error("Sản phẩm đang tạm hết hoặc vượt quá số lượng trong kho.");
                return;
            }

            if (response.data === "Sản phẩm đang tạm hết hoặc vượt quá số lượng trong kho.") {
                toast.error(response.data); // fallback nếu backend đã đổi thông báo
                return;
            }


            const maxQuantity = response.data.maxQuantity;
            if (totalDesiredQuantity > maxQuantity) {
                toast.error(`Số lượng sản phẩm vượt quá khả năng cung cấp. Số lượng tối đa: ${maxQuantity}`);
                return;
            }
            // ✅ Nếu có topping được chọn thì kiểm tra topping còn nguyên liệu
            if (selectedToppings.length > 0) {
                try {
                    // Tính tổng số lượng cho từng topping (bao gồm cả những sản phẩm khác giống hệt)
                    const allToppings = selectedProducts.reduce((acc, product) => {
                        product.toppings.forEach(topping => {
                            acc[topping.toppingId] = (acc[topping.toppingId] || 0) + product.quantity;
                        });
                        return acc;
                    }, {});

// Trừ đi topping của sản phẩm đang chỉnh sửa (nếu có)
                    editingProduct.toppings.forEach(topping => {
                        allToppings[topping.toppingId] -= editingProduct.quantity;
                        if (allToppings[topping.toppingId] <= 0) delete allToppings[topping.toppingId];
                    });

// Cộng lại topping mới từ người dùng sửa
                    updatedToppings.forEach(topping => {
                        allToppings[topping.toppingId] = (allToppings[topping.toppingId] || 0) + parseInt(quantity, 10);
                    });

// Gửi dạng Map<toppingId, quantity>
                    const toppingCheckResponse = await axios.post('http://localhost:8081/api/check/topping-availability', {
                        toppingQuantities: allToppings
                    });


                    const toppingResult = toppingCheckResponse.data;

                    if (toppingResult.unavailableToppings && toppingResult.unavailableToppings.length > 0) {
                        toast.error(`Các topping sau đang tạm hết hoặc vượt quá số lượng trong kho: ${toppingResult.unavailableToppings.join(", ")}`);
                        return;
                    }
                } catch (error) {
                    toast.error('Có lỗi xảy ra khi kiểm tra topping!');
                    console.error(error);
                    return;
                }
            }


            // Nếu đủ nguyên liệu → cập nhật giỏ hàng
            const updatedProducts = selectedProducts.map((product) => {
                const currentUniqueId = generateUniqueId(product.productId, product.sizeId, product.toppings);
                const editingUniqueId = generateUniqueId(editingProduct.productId, editingProduct.sizeId, editingProduct.toppings);

                if (currentUniqueId === editingUniqueId) {
                    return {
                        ...product,
                        sizeId: selectedSize,
                        sizeName,
                        quantity: parseInt(quantity, 10),
                        toppings: updatedToppings,
                        price: productPrice,
                    };
                }

                return product;
            });

            setSelectedProducts(updatedProducts);
            setEditingProduct(null); // Đóng modal
        } catch (error) {
            toast.error('Có lỗi xảy ra khi kiểm tra nguyên liệu!');
            console.error(error);
        }
    };



    const handleSearch = async () => {
        setSearchTriggered(true); // Bật trạng thái tìm kiếm
        setCurrentPage(0); // Đặt lại trang về 0 khi bắt đầu tìm kiếm
        setIsPaginated(true); // ← THÊM DÒNG NÀY

        try {
            const productsData = await searchProducts(searchTerm, 0, 9); // Trang 0 với size 9
            setFilteredProducts(productsData.content);
            setProducts(productsData.content); // Có thể đồng bộ 2 state
            setTotalPages(productsData.totalPages);
        } catch (error) {
            console.error("Error searching products:", error);
        }
    };

    const handlePageChange = async (page) => {
        if (page < 0 || page >= totalPages) return;
        setCurrentPage(page);

        try {
            let productsData;

            if (searchTriggered) {
                // Nếu đang tìm kiếm → gọi API search
                productsData = await searchProducts(searchTerm, page, 9);
                setProducts(productsData.content || []);
                setFilteredProducts(productsData.content || []);
                setTotalPages(productsData.totalPages || 0);
            } else if (categoryCodeSelected) {
                // Nếu đang chọn danh mục → phân trang thủ công
                const startIndex = page * 9;
                const endIndex = startIndex + 9;
                const paginated = filteredProducts.slice(startIndex, endIndex);
                setProducts(paginated);
            } else {
                // Tất cả sản phẩm → gọi lại API
                productsData = await getAllProduct(page, 9);
                setProducts(productsData.content || []);
                setFilteredProducts([]); // Không dùng filteredProducts ở chế độ này
                setTotalPages(productsData.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching paginated data:", error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedTable = JSON.parse(localStorage.getItem("selectedTable")); // Lấy bàn từ localStorage
                if (storedTable && storedTable.tableId === parseInt(id)) {
                    setTable(storedTable); // Dùng bàn từ localStorage nếu khớp
                } else {
                    const tableData = await getTableById(id); // Gọi API nếu không có trong localStorage
                    setTable(tableData);
                }

                const categoriesData = await getAllCategories();
                setCategories(categoriesData);

                const sizesData = await getAllSizes();
                setSizes(sizesData);

                const toppingsData = await getAllToppings(); // Gọi API lấy danh sách topping
                console.log("Topping:", toppingsData); // Log danh sách topping
                setToppings(toppingsData); // Lưu danh sách topping vào state

                const productsData = await getAllProduct(0, 9); // Lấy trang 0 và số lượng 9 sản phẩm mỗi trang
                setProducts(productsData.content); // Lưu danh sách sản phẩm vào state
                setFilteredProducts(productsData.content); // Khởi tạo danh sách sản phẩm lọc ban đầu
                setTotalPages(productsData.totalPages); // Cập nhật tổng số trang

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const openDeleteModal = (uniqueId) => {
        setProductToDelete({uniqueId});  // Lưu uniqueId vào state để xóa
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setProductToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = () => {
        const updatedProducts = selectedProducts.filter(
            (product) => product.uniqueId !== productToDelete.uniqueId  // So sánh và xóa theo uniqueId
        );
        setSelectedProducts(updatedProducts); // Cập nhật danh sách
        closeDeleteModal(); // Đóng modal
    };

    // const handleShowAllProducts = () => {
    //     // setCategoryCodeSelected(null); // Đặt lại mã danh mục đã chọn
    //     setFilteredProducts(products); // Hiển thị tất cả sản phẩm
    //     // window.location.reload(); // Tải lại trang
    // };

    const handleCategoryClick = async (categoryCode) => {
        try {
            setCategoryCodeSelected(categoryCode);
            setSelectedCategory(categoryCode);
            setSearchTriggered(false);
            setCurrentPage(0);
            setIsPaginated(true);

            const productsData = await getProductsByCategory(categoryCode);
            setFilteredProducts(productsData); // Lưu tất cả sản phẩm danh mục
            setTotalPages(Math.ceil(productsData.length / 9)); // Tính số trang dựa trên tổng sản phẩm

            // Hiển thị trang đầu tiên
            setProducts(productsData.slice(0, 9));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        if (filteredProducts.length > 0) {
            const paginatedProducts = filteredProducts.slice(0, 9);
            setProducts(paginatedProducts); // Hiển thị 9 sản phẩm đầu tiên
        }
    }, [filteredProducts]);

    const [availableSizes, setAvailableSizes] = useState([]);
    useEffect(() => {
        console.log("Sizes đã load:", sizes);
    }, [sizes]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);

        // ✅ Truy cập đúng categoryId và categoryCode từ object con
        const categoryId = product.category?.categoryId;
        const categoryCode = product.category?.categoryCode;

        console.log("Sản phẩm được chọn:", product);
        console.log("categoryId:", categoryId);
        console.log("categoryCode:", categoryCode);

        if (categoryId === 1 || categoryCode === "DM01") {
            console.log("Sản phẩm thuộc danh mục cà phê");
            const sizeS = sizes.find(size => size.price === 0);
            if (sizeS) {
                setSelectedSize(sizeS.sizeId.toString());
                setAvailableSizes([sizeS]);
            } else {
                setSelectedSize("");
                setAvailableSizes([]);
            }
        } else {
            setAvailableSizes(sizes); // bình thường hiển thị tất cả size
            setSelectedSize("");
        }

        setQuantity(1);
        setSelectedToppings([]);
    };






    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value); // Cập nhật size được chọn
        console.log('Size được chọn:', e.target.value); // Log size được chọn
    };


    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value)); // Cập nhật số lượng
    };
    const generateUniqueId = (productId, sizeId, toppings) => {
        return `${productId}-${sizeId}-${toppings.map(t => t.toppingId).join(',')}`;  // Tạo uniqueId từ productId, sizeId và toppingIds
    };

    const handleAddToOrder = async () => {
        if (!selectedSize) {
            toast.error('Bạn cần chọn size cho sản phẩm!');
            return;
        }

        const selectedSizeData = sizes.find(size => size.sizeId === Number(selectedSize));
        const productPrice = selectedSizeData
            ? (selectedProduct.productPrice + selectedSizeData.price)
            : selectedProduct.productPrice;
        const sizeName = selectedSizeData ? selectedSizeData.sizeName : 'Không có size';

        const selectedToppingsData = selectedToppings.map((toppingId) => {
            const topping = toppings.find((t) => t.id === toppingId);
            return {
                toppingId: topping.id,
                toppingName: topping.name,
            };
        });

        const uniqueId = generateUniqueId(selectedProduct.productId, selectedSize, selectedToppingsData);

        // ✅ Tính tổng số lượng sản phẩm này (bất kể size/topping) trong giỏ hàng
        const sameProductItems = selectedProducts.filter(p => p.productId === selectedProduct.productId);
        const totalQuantityInCart = sameProductItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalDesiredQuantity = totalQuantityInCart + parseInt(quantity, 10);

        try {
            // ✅ Gửi số lượng tổng của cùng productId để kiểm tra nguyên liệu
            const response = await axios.post('http://localhost:8081/api/check/product-availability', {
                productId: selectedProduct.productId,
                quantity: totalDesiredQuantity
            });

            if (response.data !== "Sản phẩm đủ nguyên liệu để làm.") {
                if (response.data === "Sản phẩm không đủ nguyên liệu để làm.") {
                    toast.error("Sản phẩm đang tạm hết hoặc vượt quá số lượng trong kho.");
                } else {
                    toast.error("Sản phẩm đang tạm hết hoặc vượt quá số lượng trong kho.");
                }
                return;
            }

            // ✅ Kiểm tra topping cho tất cả các sản phẩm trong giỏ hàng (bao gồm topping của sản phẩm cũ và sản phẩm mới)
            const allToppings = selectedProducts.reduce((acc, product) => {
                product.toppings.forEach(topping => {
                    acc[topping.toppingId] = (acc[topping.toppingId] || 0) + product.quantity;
                });
                return acc;
            }, {});

            // Cộng thêm topping mới của sản phẩm sắp thêm vào
            selectedToppingsData.forEach(topping => {
                allToppings[topping.toppingId] = (allToppings[topping.toppingId] || 0) + parseInt(quantity, 10);
            });

            // Gửi tất cả các topping đã cộng dồn tới API để kiểm tra số lượng
            const toppingCheckResponse = await axios.post('http://localhost:8081/api/check/topping-availability', {
                toppingQuantities: allToppings
            });


            const toppingResult = toppingCheckResponse.data;

            if (toppingResult.unavailableToppings && toppingResult.unavailableToppings.length > 0) {
                const unavailableToppings = toppingResult.unavailableToppings.join(", ");
                toast.error(`Các topping sau đang tạm hết hoặc vượt quá số lượng trong kho: ${unavailableToppings}`);
                return;
            }

            // Cập nhật giỏ hàng với sản phẩm mới hoặc sản phẩm đã có
            const updatedProducts = [...selectedProducts];
            const existingProduct = updatedProducts.find(p => p.uniqueId === uniqueId);

            if (existingProduct) {
                existingProduct.quantity += parseInt(quantity, 10);
            } else {
                const newProduct = {
                    ...selectedProduct,
                    sizeId: selectedSize,
                    quantity: parseInt(quantity, 10),
                    price: productPrice,
                    sizeName: sizeName,
                    toppings: selectedToppingsData,
                    uniqueId: uniqueId,
                };
                updatedProducts.push(newProduct);
            }

            setSelectedProducts(updatedProducts);
            setIsModalOpen(false);
            setSelectedSize('');
            setQuantity(1);
            setSelectedToppings([]);

        } catch (error) {
            toast.error('Có lỗi xảy ra khi kiểm tra nguyên liệu!');
            console.error(error);
        }
    };






    const handleCancel = () => {
        setIsModalOpen(false); // Đóng modal mà không làm gì
        setSelectedSize(''); // Reset size
        setQuantity(1); // Reset số lượng
    };

    const increaseQuantity = (productId, sizeId) => {
        const updatedProducts = selectedProducts.map((product) => {
            if (product.productId === productId && product.sizeId === sizeId) {
                // Lấy thông tin size đã chọn
                const selectedSizeData = sizes.find((size) => size.sizeId === Number(product.sizeId));
                const basePrice = selectedSizeData
                    ? product.productPrice + selectedSizeData.price
                    : product.productPrice;

                // Tính tổng giá của tất cả topping
                const toppingTotalPrice = product.toppings.reduce((total, topping) => {
                    const toppingData = toppings.find((t) => t.id === topping.toppingId);
                    return total + (toppingData ? toppingData.price : 0);
                }, 0);

                // Tổng giá bao gồm sản phẩm, size và topping
                const totalPricePerItem = basePrice + toppingTotalPrice;

                const newQuantity = product.quantity + 1;
                const newTotalPrice = totalPricePerItem * newQuantity;

                console.log(`Tăng số lượng: Sản phẩm - ${product.productName}, Số lượng mới - ${newQuantity}, Giá mới - ${newTotalPrice}`);

                return {
                    ...product,
                    quantity: newQuantity,
                    totalPrice: newTotalPrice, // Cập nhật giá tổng
                };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };


    const decreaseQuantity = (productId, sizeId) => {
        const updatedProducts = selectedProducts.map(product => {
            if (product.productId === productId && product.sizeId === sizeId && product.quantity > 1) {
                const selectedSizeData = sizes.find(size => size.sizeId === Number(product.sizeId));
                const basePrice = selectedSizeData
                    ? product.productPrice + selectedSizeData.price
                    : product.productPrice;

                const newQuantity = product.quantity - 1;
                const newTotalPrice = basePrice * newQuantity;

                console.log(`Giảm số lượng: Sản phẩm - ${product.productName}, Số lượng mới - ${newQuantity}, Giá mới - ${newTotalPrice}`);

                return {
                    ...product,
                    quantity: newQuantity,
                    totalPrice: newTotalPrice, // Cập nhật giá tổng
                };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    const checkDiscountCode = async () => {
        try {
            // Kiểm tra mã giảm giá có phải là chữ hoa
            if (discountCode !== discountCode.toUpperCase()) {
                toast.error('Mã giảm giá không đúng hoặc không còn hiệu lực!');
                return; // Dừng lại nếu không đúng chữ hoa
            }

            const response = await axios.get(`http://localhost:8081/api/discounts/${discountCode.trim()}`);

            if (response.status === 200) {
                if (response.data.status) {
                    setDiscount(response.data); // Lưu discount nếu hợp lệ
                    toast.success('Mã giảm giá hợp lệ!');
                } else {
                    toast.error('Mã giảm giá không đúng hoặc không còn hiệu lực.');
                    setDiscount(null);
                }
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã giảm giá:', error);
            toast.error('Mã giảm giá không hợp lệ.');
            setDiscount(null);
        }
    };


    const calculateTotalAmount = () => {
        const totalAmount = selectedProducts.reduce((total, product) => {
            // Tổng giá sản phẩm chính
            let productTotal = product.price * product.quantity;

            // Cộng thêm giá topping (nếu có)
            if (product.toppings && product.toppings.length > 0) {
                const toppingTotal = product.toppings.reduce((sum, topping) => {
                    const toppingData = toppings.find((t) => t.id === topping.toppingId);
                    return sum + (toppingData ? toppingData.price * product.quantity : 0);
                }, 0);
                productTotal += toppingTotal;
            }

            return total + productTotal;
        }, 0);

        // Áp dụng giảm giá (nếu có)
        if (discount) {
            const discountAmount = (totalAmount * discount.value) / 100;
            return totalAmount - discountAmount;
        }

        return totalAmount;
    };

    const calculateTotalAmount1 = () => {
        const totalAmount = selectedProducts.reduce((total, product) => {
            // Tổng giá sản phẩm chính
            let productTotal = product.price * product.quantity;

            // Cộng thêm giá topping (nếu có)
            if (product.toppings && product.toppings.length > 0) {
                const toppingTotal = product.toppings.reduce((sum, topping) => {
                    const toppingData = toppings.find((t) => t.id === topping.toppingId);
                    return sum + (toppingData ? toppingData.price * product.quantity : 0);
                }, 0);
                productTotal += toppingTotal;
            }

            return total + productTotal;
        }, 0);


        return totalAmount;
    };
    const handleRemoveProduct = (productId, sizeId) => {
        const updatedProducts = selectedProducts.filter(
            (product) => !(product.productId === productId && product.sizeId === sizeId)
        );
        setSelectedProducts(updatedProducts); // Cập nhật danh sách
    };

    const handlePlaceOrder = async (paymentMethod) => {
        if (selectedProducts.length === 0) {
            toast.error("Bạn cần chọn ít nhất một sản phẩm.");
            return;
        }
        if (discountCode && !discount) {
            toast.error("Bạn cần kiểm tra và xác nhận mã giảm giá trước khi đặt hàng.");
            return;
        }

        const totalPrice = calculateTotalAmount();

        const orderData = {
            table: {tableId: table?.tableId},
            totalPrice: totalPrice,
            paymentStatus: paymentMethod === "cash" ? "cash" : "transfer", // Gửi trạng thái thanh toán
            products: selectedProducts.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                price: (product.productPrice + (product.sizePrice || 0)) * product.quantity,
                sizeId: product.sizeId,
                noteProduct: product.noteProduct || "",
                shippingDay: new Date().toLocaleString("sv-SE").replace("T", " "),
                toppings: product.toppings.map((topping) => {
                    const toppingData = toppings.find((t) => t.id === topping.toppingId);
                    const toppingPrice = toppingData ? toppingData.price : 0; // Nếu không tìm thấy topping, giá là 0

                    // Log để kiểm tra topping price
                    console.log(`Topping ID: ${topping.toppingId}, Topping Name: ${topping.toppingName}, Topping Price: ${toppingPrice}`);
                    return {
                        id: topping.toppingId,
                        name: topping.toppingName,
                        price: toppingPrice,
                    };
                }),
            })),
            code: discountCode,
        };

        try {
            const token = localStorage.getItem("token");
            const txnRef = uuidv4();
            const createDate = new Date().toISOString().replace(/[-:]/g, "").slice(0, 14);
            const expireDate = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:]/g, "").slice(0, 14);

            const queryParams = new URLSearchParams({
                amount: totalPrice,
                orderInfo: `Thanh toán đơn hàng ${txnRef}`,
                txnRef: txnRef,
                createDate: createDate,
                expireDate: expireDate,
            }).toString();

            const paymentUrl = `http://localhost:8081/api/payment/create_payment?${queryParams}`;
            if (paymentMethod === "cash") {
                const response = await axios.post("http://localhost:8081/api/orders/place", orderData, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (response.data && response.data.id) {
                    setCallOrderId(response.data.id); // Lưu ID đơn hàng để gửi đánh giá
                    setIsFeedbackModalOpen(true); // Mở modal đánh giá
                    console.log("Modal state after setting:", isFeedbackModalOpen); // Kiểm tra modal có được mở không
                }


                toast.success("Đặt hàng thành công !");
                setIsPaymentModalOpen(false); // 👉 Đóng modal thanh toán
                const paidTables = JSON.parse(localStorage.getItem("paidTables")) || [];
                if (!paidTables.includes(table.tableId)) {
                    paidTables.push(table.tableId);
                    localStorage.setItem("paidTables", JSON.stringify(paidTables));
                }
            } else if (paymentMethod === "transfer") {
                localStorage.setItem("orderData", JSON.stringify(orderData)); // Lưu dữ liệu đơn hàng trước
                const response = await axios.get(paymentUrl, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const {url} = response.data;
                if (url) {
                    window.location.href = url; // Redirect tới URL thanh toán
                } else {
                    throw new Error("Không tìm thấy URL thanh toán trong phản hồi");
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            toast.error("Sản phẩm này đang tạm hết, vui lòng chọn sản phẩm khác.");
        }
        setSelectedProducts([]);
        setDiscountCode("");
        setDiscount(null); // <- Dòng này sẽ reset phần khuyến mãi hiển thị
    };
    useEffect(() => {
        console.log("isFeedbackModalOpen changed:", isFeedbackModalOpen);
    }, [isFeedbackModalOpen]);

    const handleNoteChange = (productId, sizeId, note) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.productId === productId && product.sizeId === sizeId // Phân biệt sản phẩm cụ thể
                ? {...product, noteProduct: note}
                : product
        );
        setSelectedProducts(updatedProducts); // Cập nhật state
    };
    //
    // const handleToppingChange = (productId, toppingName) => {
    //     setSelectedProducts((prevProducts) =>
    //         prevProducts.map((product) =>
    //             product.productId === productId
    //                 ? {...product, selectedTopping: toppingName}
    //                 : product
    //         )
    //     );
    // };
    const handleSubmitFeedback = async () => {
        if (!callOrderId) {
            toast.error("Không tìm thấy đơn hàng!");
            return;
        }

        const feedbackData = {
            reviewerName: reviewerName.trim(),
            rating: rating,
            content: content.trim(),
        };



        // console.log("🟢 Dữ liệu gửi lên server:", feedbackData);

        if (!feedbackData.content) {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:8081/api/feedback/${callOrderId}`,
                feedbackData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("🟢 Phản hồi từ server:", response.data);

            toast.success("Cảm ơn bạn đã đánh giá!");
            setIsFeedbackModalOpen(false);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 5000);
        } catch (error) {
            console.error("🔴 Lỗi khi gửi đánh giá:", error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    const handleShowAllProducts = async () => {
        setSearchTerm("");
        setSearchTriggered(false);
        setCategoryCodeSelected(null);
        setSelectedCategory(null);
        setCurrentPage(0);

        try {
            const allProductsData = await getAllProduct(0, 9);
            setProducts(allProductsData.content || []);
            setTotalPages(allProductsData.totalPages || 0);

            // ❗ KHÔNG nên setFilteredProducts(allProductsData.content)
            setFilteredProducts([]); // Để tránh hiểu nhầm đang phân trang thủ công
        } catch (error) {
            // console.error("Error fetching all products:", error);
        }
    };


    useEffect(() => {
        if (!isFeedbackModalOpen) {
            // Khi modal đóng, reset dữ liệu
            setReviewerName("");
            setRating(0);
            setContent("");
        }
    }, [isFeedbackModalOpen]);

    // if (loading) return <p>Loading...</p>;
    // if (!table) return <p>Table not found</p>;
    // console.log("Selected Products:", selectedProducts);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <div className={styles.tableHeader}>
                <p className={styles.tableName}>
                    <strong>{table?.tableName}</strong>
                </p>
            </div>

            {/* Các phần danh mục và sản phẩm */}
            <div className={styles.contentWrapper}>
                {/* Bên trái */}
                <div className={styles.containero}>
                    {/* Danh mục sản phẩm - Hiển thị ngang */}
                    <div className={styles.categoryBar}>
                        {/* Nút "Tất cả sản phẩm" */}
                        <button
                            onClick={handleShowAllProducts}
                            className={`${styles.allProductsButton} ${!selectedCategory ? styles.active : ''}`}
                        >
                            {/*<FontAwesomeIcon icon={faListAlt} className={styles.icon}/>*/}
                            Tất cả sản phẩm
                        </button>


                        {/* Danh mục sản phẩm */}
                        {categories.map((category, index) => (
                            <button
                                key={category.categoryId}
                                onClick={() => handleCategoryClick(category.categoryCode)}
                                className={`${styles.categoryButton} ${selectedCategory === category.categoryCode ? styles.active : ''}`}
                            >
                                {category.categoryName}
                            </button>
                        ))}
                    </div>

                    {/* Phần tìm kiếm và danh sách sản phẩm */}
                    <div className={styles.middleSection}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleSearch}>Tìm kiếm</button>
                        </div>

                        <div className={styles.productGrid}>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product.productId}
                                        className={styles.productCard}
                                        onClick={() => handleProductClick(product)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <img
                                            src={product.productImgUrl}
                                            alt={product.productName}
                                            className={styles.productImage}
                                        />
                                        <h4 className={styles.productName}>{product.productName}</h4>
                                        <p className={styles.productPrice}>
                                            {product.productPrice.toLocaleString('vi-VN')} VND
                                        </p>

                                    </div>
                                ))
                            ) : searchTriggered ? (
                                <p>Không tìm thấy sản phẩm nào.</p>
                            ) : (
                                <p>Đang tải dữ liệu...</p>
                            )}
                        </div>


                        {/* Hiển thị phân trang nếu có phân trang */}
                        {isPaginated && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}>
                                    Previous
                                </button>
                                <span>Page {currentPage + 1} of {totalPages > 0 ? totalPages : 1}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1 || totalPages === 0}>
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Bên phải */}
                <div className={styles.rightSection}>
                    <div className={styles.bodyOder}>
                        <div className={styles.tableContainer}>
                            <table className={`table table-striped table-bordered table-hover ${styles.table}`}>
                                <thead>
                                <tr>
                                    <td style={{backgroundColor: 'black', color: 'white'}}>Danh Sách Oder Món</td>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedProducts.length > 0 ? (
                                    selectedProducts.map((product, index) => (
                                        <React.Fragment key={`${product.productId}-${product.sizeId || "default"}`}>
                                            <tr
                                                onClick={() => openEditModal(product)}
                                                style={{cursor: "pointer"}} // Hiển thị con trỏ tay khi hover
                                            >
                                                <td className={styles.tableCell}
                                                    style={{
                                                        width: "17%",
                                                        wordWrap: "break-word",
                                                        wordBreak: "break-word",
                                                        whiteSpace: "normal",
                                                        overflowWrap: "break-word",
                                                        textAlign: "left"
                                                    }}>
                                                    <div className={styles.fixedXContainer}>
                                                        <span className={styles.fixedX}>x</span>

                                                         <span></span> {product.productName}
                                                    </div>
                                                </td>

                                                <td className={styles.tableCell} style={{
                                                    width: "18%",
                                                    wordWrap: "break-word",
                                                    textAlign: "center",
                                                    marginLeft: "0px",
                                                    padding:"0px"
                                                }}>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            style={{padding:'10px'}}
                                                            className={`btn btn-sm btn-outline-primary me-2 ${styles.btnOutlinePrimary}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Ngăn chặn sự kiện click tràn xuống dòng
                                                                decreaseQuantity(product.productId, product.sizeId);
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{product.quantity}</span>
                                                        <button
                                                            className={`btn btn-sm btn-outline-danger ms-2 ${styles.btnOutlineDanger}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                increaseQuantity(product.productId, product.sizeId);
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className={styles.tableCell}
                                                    style={{width: "17%", wordWrap: "break-word", textAlign: "center"}}>
                                                    {(product.price * product.quantity).toLocaleString("vi-VN")} VND
                                                </td>
                                                <td className={styles.tableCell}
                                                    style={{width: "11%", wordWrap: "break-word", textAlign: "center"}}>
                                                    {product.sizeName}
                                                </td>
                                                <td className={styles.tableCell}
                                                    style={{width: "30%", wordWrap: "break-word", textAlign: "center"}}>
                                                    <input
                                                        type="text"
                                                        value={product.noteProduct || ""}
                                                        onChange={(e) =>
                                                            handleNoteChange(product.productId, product.sizeId, e.target.value)
                                                        }
                                                        placeholder="Nhập ghi chú"
                                                        className={`${styles.noteInput} form-control`}
                                                        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan ra
                                                    />
                                                </td>

                                                <td className={styles.tableCell}
                                                    style={{width: '7%', textAlign: "end", verticalAlign: "middle"}}>
                                                    <div className={styles.iconContainer}>
                                                        <i
                                                            className={`fa fa-trash text-danger ${styles.iconDelete}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDeleteModal(product.uniqueId);
                                                            }}
                                                        ></i>
                                                    </div>
                                                </td>
                                            </tr>
                                            {product.toppings && product.toppings.length > 0 && (
                                                <tr>
                                                    <td colSpan="7" className="text-muted">
                                                    <strong>Topping:</strong>{" "}
                                                        {product.toppings
                                                            .map((topping) => {
                                                                const toppingData = toppings.find((t) => t.id === topping.toppingId);
                                                                const toppingPrice = toppingData ? toppingData.price : 0;
                                                                return `${topping.toppingName} (${toppingPrice.toLocaleString("vi-VN")}₫)`;
                                                            })
                                                            .join(", ")}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">Không có sản phẩm nào trong giỏ hàng
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className={styles.summaryContainer}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Giá gốc:</span>
                                    <div className={styles.separator}></div>
                                    <span
                                        className={styles.summaryValue}>{calculateTotalAmount1().toLocaleString("vi-VN")} VND</span>
                                </div>

                                {discount && (
                                    <div className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>Khuyến mãi:</span>
                                        <div className={styles.separator}></div>
                                        <span className={styles.summaryValue}>
                            {discount.value}%
                        </span>
                                    </div>
                                )}

                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Tổng tiền:</span>
                                    <div className={styles.separator}></div>
                                    <span
                                        className={styles.summaryValue}>{calculateTotalAmount().toLocaleString("vi-VN")} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className={styles.discountContainer}>
                        <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Nhập mã giảm giá"
                            className={styles.discountInput}
                        />
                        <button onClick={checkDiscountCode} className={styles.discountButton}>
                            Kiểm tra mã
                        </button>
                    </div>
                    <div className={styles.buttonContainer}>
                        <div className={styles.buttonWrapper}>
                            <button
                                onClick={backHome}
                                className={styles.callForServiceButton}
                            >
                                Trang chủ
                            </button>
                            <button onClick={() => setIsChoiceModalVisible(true)}
                                    className={styles.callForServiceButton}>
                                Gọi phục vụ
                            </button>
                            <button onClick={() => setIsPaymentModalOpen(true)} className={styles.callForServiceButton}>
                                Đặt Hàng
                            </button>

                            <ChatBox/>
                            {/* Icon gợi ý sản phẩm */}
                            <div className={styles.productSuggestionContainer} onClick={() => setShowModal(true)}>
                                <div className={styles.text}>Gợi ý món!</div>
                                <div className={styles.arrow}></div>
                                <div className={styles.productSuggestionIcon}>
                                <i className="fa-solid fa-mug-hot"></i>
                                </div>
                            </div>


                            {/* Modal sản phẩm bán chạy */}
                            <TopSellingModal show={showModal} onClose={() => setShowModal(false)}/>

                            <Modal
                                title="Chọn yêu cầu"
                                visible={isChoiceModalVisible}
                                onCancel={() => setIsChoiceModalVisible(false)}
                                footer={null}
                                centered
                            >
                                <div className={styles.modalContainerb}>
                                    {["Gọi phục vụ", "Tính tiền", "Đổi món"].map((type) => {
                                        const getIcon = (type) => {
                                            switch (type) {
                                                case "Gọi phục vụ":
                                                    return <span style={{marginRight: 8}}>🔔</span>;
                                                case "Tính tiền":
                                                    return <span style={{marginRight: 8}}>💵</span>;
                                                case "Đổi món":
                                                    return <span style={{marginRight: 8}}>🔄</span>;
                                                default:
                                                    return null;
                                            }
                                        };
                                        return (
                                            <button
                                                key={type}
                                                className={styles.modalButtonb}
                                                onClick={() => handleServiceType(type)}
                                            >
                                                {getIcon(type)}
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Modal>

                            <Modal1
                                isOpen={isPaymentModalOpen}
                                onRequestClose={() => setIsPaymentModalOpen(false)}
                                contentLabel="Payment Modal"
                                ariaHideApp={false}
                                className={styles["modal-content"]}
                                overlayClassName={styles["react-modal-overlay"]}
                            >
                                <h2>Chọn phương thức thanh toán</h2>
                                <button
                                    onClick={() => handlePlaceOrder("cash")}
                                    className={styles["modal-button"]}
                                >
                                    <FaMoneyBillWave/> Thanh toán bằng tiền mặt
                                </button>
                                <button
                                    onClick={() => handlePlaceOrder("transfer")}
                                    className={styles["modal-button"]}
                                >
                                    <FaCreditCard/> Thanh toán chuyển khoản
                                </button>
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className={styles["modal-close-button"]}
                                >
                                    <FaTimes/> Hủy
                                </button>
                            </Modal1>
                            <Modal1
                                isOpen={isFeedbackModalOpen}
                                onRequestClose={() => setIsFeedbackModalOpen(false)}
                                contentLabel="Feedback Modal"
                                ariaHideApp={false}
                                className={styles["modal-contentx"]}
                                overlayClassName={styles["react-modal-overlayx"]}
                            >
                                <h2>Đánh giá dịch vụ</h2>
                                <p>Hãy để lại đánh giá của bạn!</p>

                                <div className={styles["ratingx"]}>
                                    <span>Chất lượng: </span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={star <= rating ? styles["active-starx"] : ""}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>

                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Nhập đánh giá của bạn..."
                                    className={styles["feedback-textareax"]}
                                />
                                <input
                                    type="text"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    placeholder="Nhập tên của bạn"
                                    className={styles["feedback-inputx"]}
                                />

                                <div className={styles["buttonGrouphx"]}>
                                    <button onClick={handleSubmitFeedback} className={styles["submitButtonhx"]}>
                                        Gửi đánh giá
                                    </button>
                                    <button onClick={() => setIsFeedbackModalOpen(false)}
                                            className={styles["cancelButtonhx"]}>
                                        Hủy
                                    </button>
                                </div>
                            </Modal1>


                            {/*<button*/}
                            {/*    onClick={handlePlaceOrder}*/}
                            {/*    className={styles.callForServiceButton}*/}
                            {/*>*/}
                            {/*    Đặt Hàng*/}
                            {/*</button>*/}
                        </div>

                        {/* Modal thông báo */}
                        <Modal
                            title="Thông Báo"
                            visible={isModalVisible}
                            onOk={() => setIsModalVisible(false)}
                            onCancel={() => setIsModalVisible(false)}
                            footer={[
                                <button
                                    key="ok"
                                    onClick={() => setIsModalVisible(false)}
                                    className={styles.modalButton}
                                >
                                    OK
                                </button>
                            ]}
                            className={styles.modalContainer}
                            bodyStyle={{padding: '20px'}}
                        >
                            <p className={styles.modalContent}>{modalContent}</p>
                        </Modal>
                    </div>


                </div>
            </div>
            {editingProduct && (
                <div className={stylesAddProductModal.addProductBackdrop}>
                    <div className={stylesAddProductModal.addProductDialog}>
                        <div className={stylesAddProductModal.addProductHeader}>
                            <h4>Chỉnh sửa sản phẩm</h4>
                        </div>
                        <div className={stylesAddProductModal.addProductBody}>
                            {/* Hiển thị hình ảnh sản phẩm */}
                            <div className={stylesAddProductModal.productImage}>
                                <img
                                    src={selectedProduct.productImgUrl}
                                    alt={selectedProduct.productName}
                                    className={stylesAddProductModal.image}
                                />
                            </div>
                            <p>
                                <strong>{editingProduct.productName}</strong>
                            </p>
                            <label>Chọn Size:</label>
                            <select
                                className={stylesAddProductModal.selectInput}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                value={selectedSize}
                            >
                                <option value="">Chọn size</option>
                                {sizes.map((size) => (
                                    <option key={size.sizeId} value={size.sizeId}>
                                        {size.sizeName} - {size.price.toLocaleString()}đ
                                    </option>
                                ))}
                            </select>

                            <div>
                                <label>Số Lượng:</label>
                                <input
                                    type="number"
                                    className={stylesAddProductModal.numberInput}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min="1"
                                />
                            </div>

                            <div>
                                <label>Chọn Topping:</label>
                                <div className={stylesAddProductModal.toppingCheckboxGroup}>
                                    {toppings.map((topping) => (
                                        <div key={topping.id}>
                                            <input
                                                type="checkbox"
                                                id={`edit-topping-${topping.id}`}
                                                value={topping.id}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (e.target.checked) {
                                                        setSelectedToppings((prev) => [...prev, value]);
                                                    } else {
                                                        setSelectedToppings((prev) =>
                                                            prev.filter((toppingId) => toppingId !== value)
                                                        );
                                                    }
                                                }}
                                                checked={selectedToppings.includes(topping.id)}
                                            />
                                            <label htmlFor={`edit-topping-${topping.id}`}>
                                                {topping.name} - {topping.price.toLocaleString()}đ
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={stylesAddProductModal.addProductFooter}>
                            <button
                                onClick={handleSaveEdit}
                                className={`${stylesAddProductModal.btnPrimary}`}
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className={`${stylesAddProductModal.btnSecondary}`}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showDeleteModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalDialog}>
                        <div className={styles.modalHeader}>
                            <h5>Xác nhận xóa</h5>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={closeDeleteModal}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className={styles.btnDanger}
                                onClick={confirmDelete}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isModalOpen && (
                <div className={stylesAddProductModal.addProductBackdrop}>
                    <div className={stylesAddProductModal.addProductDialog}>
                        <div className={stylesAddProductModal.addProductHeader}>
                            <h4>Thêm Sản phẩm</h4>
                        </div>
                        <div className={stylesAddProductModal.addProductBody}>
                            {/* Hiển thị hình ảnh sản phẩm */}
                            <div className={stylesAddProductModal.productImage}>
                                <img
                                    src={selectedProduct.productImgUrl}
                                    alt={selectedProduct.productName}
                                    className={stylesAddProductModal.image}
                                />
                            </div>
                            <p>
                                <strong>{selectedProduct.productName}</strong>
                            </p>
                            <label>Chọn Size:</label>
                            <select
                                className={stylesAddProductModal.selectInput}
                                onChange={handleSizeChange}
                                value={selectedSize}
                            >
                                <option value="">Chọn size</option>
                                {/*<option value="">Chọn size</option>*/}
                                {availableSizes.map((size) => (
                                    <option key={size.sizeId} value={size.sizeId}>
                                        {size.sizeName} - {size.price.toLocaleString("vi-VN").replace(/,/g, ".")}đ
                                    </option>
                                ))}
                            </select>

                            <div>
                                <label>Số Lượng:</label>
                                <input
                                    type="number"
                                    className={stylesAddProductModal.numberInput}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                />
                            </div>

                            {/* Thêm phần chọn topping */}
                            <div>
                                <label>Chọn Topping:</label>
                                <div className={stylesAddProductModal.toppingCheckboxGroup}>
                                    {toppings.map((topping) => (
                                        <div key={topping.id}>
                                            <input
                                                type="checkbox"
                                                id={`topping-${topping.id}`}
                                                value={topping.id}
                                                onChange={(e) => {
                                                    const value = Number(e.target.value);
                                                    if (e.target.checked) {
                                                        setSelectedToppings((prev) => [...prev, value]);
                                                    } else {
                                                        setSelectedToppings((prev) =>
                                                            prev.filter((toppingId) => toppingId !== value)
                                                        );
                                                    }
                                                }}
                                                checked={selectedToppings.includes(topping.id)}
                                            />
                                            <label htmlFor={`topping-${topping.id}`}>
                                                {topping.name}
                                            </label>
                                            <span className={stylesAddProductModal.toppingPrice}>
                    {topping.price.toLocaleString()}đ
                </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className={stylesAddProductModal.addProductFooter}>
                            <button
                                onClick={handleAddToOrder}
                                className={`${stylesAddProductModal.btnPrimary}`}
                            >
                                Thêm
                            </button>
                            <button
                                onClick={handleCancel}
                                className={`${stylesAddProductModal.btnSecondary}`}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer/>
        </div>
    )
        ;
};

export default TableDetail;