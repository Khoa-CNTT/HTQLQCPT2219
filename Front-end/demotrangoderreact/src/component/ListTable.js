// src/components/TableList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTables } from '../service/TableService';

const TableList = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getAllTables();
                setTables(data);
            } catch (error) {
                console.error("Error fetching table data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Danh Sách Tên Bàn</h2>
            <ul>
                {tables.map((table) => (
                    <li key={table.tableId}>
                        <Link to={`/tables/${table.tableId}`}>{table.tableName}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableList;

//
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
//
// import { getTableById } from '../service/TableService';
// import { getAllCategories } from '../service/CategoryService';
// import { getProductsByCategory } from '../service/ProductService';
// import { getAllSizes } from '../service/SizeService'; // Import API size
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
// import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toast
//
// const TableDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [table, setTable] = useState(null);
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [selectedProducts, setSelectedProducts] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false); // Để quản lý modal
//     const [selectedProduct, setSelectedProduct] = useState(null); // Để lưu thông tin sản phẩm được chọn
//     const [selectedSize, setSelectedSize] = useState(''); // Để lưu size được chọn
//     const [quantity, setQuantity] = useState(1); // Để lưu số lượng được chọn
//
//     useEffect(() => {
//         const fetchTableAndCategories = async () => {
//             try {
//                 const tableData = await getTableById(id);
//                 setTable(tableData);
//
//                 const categoriesData = await getAllCategories();
//                 setCategories(categoriesData);
//
//                 const sizesData = await getAllSizes(); // Fetch sizes from API
//                 setSizes(sizesData);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchTableAndCategories();
//     }, [id]);
//
//     const handleCategoryClick = async (categoryCode) => {
//         try {
//             const productsData = await getProductsByCategory(categoryCode);
//             setProducts(productsData);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//         }
//     };
//
//     const handleProductClick = (product) => {
//         setSelectedProduct(product); // Lưu thông tin sản phẩm được chọn
//         setIsModalOpen(true); // Mở modal khi chọn sản phẩm
//     };
//
//     const handleSizeChange = (e) => {
//         setSelectedSize(e.target.value); // Cập nhật size được chọn
//     };
//
//     const handleQuantityChange = (e) => {
//         setQuantity(Number(e.target.value)); // Cập nhật số lượng
//     };
//
//     const handleAddToOrder = () => {
//         if (!selectedSize) {
//             toast.error('Bạn cần chọn size cho sản phẩm!');
//             return;
//         }
//
//         // Lấy giá sản phẩm theo size
//         const selectedSizeData = sizes.find(size => size.sizeId === Number(selectedSize));
//         const productPrice = selectedSizeData ? selectedSizeData.price : selectedProduct.productPrice; // Sử dụng giá theo size nếu có
//
//         const newProduct = {
//             ...selectedProduct,
//             sizeId: selectedSize,
//             quantity,
//             price: productPrice, // Cập nhật giá sản phẩm theo size
//             sizeName: selectedSizeData ? selectedSizeData.sizeName : 'Không có size', // Lưu tên size vào dữ liệu
//         };
//
//         setSelectedProducts([...selectedProducts, newProduct]); // Thêm sản phẩm vào bảng order
//         setIsModalOpen(false); // Đóng modal
//         setSelectedSize(''); // Reset size
//         setQuantity(1); // Reset số lượng
//     };
//
//     const handleCancel = () => {
//         setIsModalOpen(false); // Đóng modal mà không làm gì
//         setSelectedSize(''); // Reset size
//         setQuantity(1); // Reset số lượng
//     };
//
//     const increaseQuantity = (productId) => {
//         const updatedProducts = selectedProducts.map(product =>
//             product.productId === productId ? { ...product, quantity: product.quantity + 1 } : product
//         );
//         setSelectedProducts(updatedProducts);
//     };
//
//     const decreaseQuantity = (productId) => {
//         const updatedProducts = selectedProducts.map(product =>
//             product.productId === productId && product.quantity > 1
//                 ? { ...product, quantity: product.quantity - 1 } : product
//         );
//         setSelectedProducts(updatedProducts);
//     };
//
//     const calculateTotalAmount = () => {
//         const totalAmount = selectedProducts.reduce((total, product) => {
//             return total + (product.price * product.quantity); // Sử dụng giá theo size đã chọn
//         }, 0);
//
//         return totalAmount;
//     };
//
//     const handlePlaceOrder = async () => {
//         if (selectedProducts.length === 0) {
//             toast.error('Bạn cần chọn ít nhất một sản phẩm.');
//             return;
//         }
//
//         const orderData = {
//             user: { userId: 1 },  // Thay bằng id người dùng thực tế
//             table: { tableId: table.tableId },
//             products: selectedProducts.map(product => ({
//                 productId: product.productId,
//                 quantity: product.quantity,
//                 price: product.price,
//                 sizeId: product.sizeId,
//                 shippingDay: "2024-11-14", // Thay bằng ngày thực tế
//             })),
//         };
//
//         try {
//             const response = await axios.post("http://localhost:8080/api/orders/place", orderData);
//             toast.success('Đơn hàng đã được thanh toán thành công!');
//         } catch (error) {
//             toast.error('Có lỗi xảy ra khi đặt đơn hàng.');
//         }
//     };
//
//     if (loading) return <p>Loading...</p>;
//     if (!table) return <p>Table not found</p>;
//
//     return (
//         <div style={{ display: 'flex' }}>
//             <div style={{ flex: 1, marginRight: '20px' }}>
//                 <h2>Chi Tiết Bàn</h2>
//                 <p><strong>Tên Bàn:</strong> {table.tableName}</p>
//
//                 <h3>Danh Sách Các Danh Mục</h3>
//                 <ul>
//                     {categories.map(category => (
//                         <li key={category.categoryId}>
//                             <button onClick={() => handleCategoryClick(category.categoryCode)}>
//                                 {category.categoryName}
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//
//                 <h3>Sản Phẩm Thuộc Danh Mục:</h3>
//                 <ul>
//                     {products.map(product => (
//                         <li key={product.productId}>
//                             <button onClick={() => handleProductClick(product)}>
//                                 {product.productName} - {product.productPrice} VND
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//
//             <div style={{ flex: 1 }}>
//                 <h3>Thông Tin Sản Phẩm</h3>
//                 <table border="1" style={{ width: '100%', marginTop: '20px' }}>
//                     <thead>
//                     <tr>
//                         <th>STT</th>
//                         <th>Tên Sản phẩm</th>
//                         <th>Số lượng</th>
//                         <th>Giá tiền</th>
//                         <th>Tên bàn</th>
//                         <th>Size</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {selectedProducts.length > 0 ? (
//                         selectedProducts.map((product, index) => (
//                             <tr key={`${product.productId}-${product.sizeId || 'default'}`}>
//                                 <td>{index + 1}</td>
//                                 <td>{product.productName}</td>
//                                 <td>
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                         <button onClick={() => increaseQuantity(product.productId)}
//                                                 style={{ marginRight: '10px' }}>+</button>
//                                         <span>{product.quantity}</span>
//                                         <button onClick={() => decreaseQuantity(product.productId)}
//                                                 style={{ marginLeft: '10px' }}>-</button>
//                                     </div>
//                                 </td>
//                                 <td>{product.price * product.quantity} VND</td>
//                                 <td>{table.tableName}</td>
//                                 <td>{product.sizeName}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="6">Không có sản phẩm nào trong giỏ hàng</td>
//                         </tr>
//                     )}
//                     <tr>
//                         <td colSpan="5" style={{ fontWeight: 'bold' }}>Tổng tiền:</td>
//                         <td>{calculateTotalAmount()} VND</td>
//                     </tr>
//                     </tbody>
//                 </table>
//
//                 {selectedProducts.length > 0 && (
//                     <div style={{ marginTop: '20px' }}>
//                         <button onClick={handlePlaceOrder} style={{ padding: '10px', fontSize: '16px' }}>
//                             Đặt Hàng
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             {isModalOpen && (
//                 <div style={{
//                     position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
//                     backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
//                     alignItems: 'center', zIndex: 1000
//                 }}>
//                     <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '300px' }}>
//                         <h4>Thêm Sản phẩm</h4>
//                         <p><strong>{selectedProduct.productName}</strong></p>
//
//                         <label>Chọn Size:</label>
//                         <select onChange={handleSizeChange} value={selectedSize}>
//                             <option value="">Chọn size</option>
//                             {sizes.map(size => (
//                                 <option key={size.sizeId} value={size.sizeId}>
//                                     {size.sizeName}
//                                 </option>
//                             ))}
//                         </select>
//
//                         <div>
//                             <label>Số Lượng:</label>
//                             <input type="number" value={quantity} onChange={handleQuantityChange} min="1" />
//                         </div>
//
//                         <button onClick={handleAddToOrder} style={{ marginTop: '10px' }}>
//                             Thêm
//                         </button>
//                         <button onClick={handleCancel} style={{ marginLeft: '10px' }}>
//                             Hủy
//                         </button>
//                     </div>
//                 </div>
//             )}
//
//             <ToastContainer />
//         </div>
//     );
// };
//
// export default TableDetail;
