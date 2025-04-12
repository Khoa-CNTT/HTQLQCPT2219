import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderDetailsByTable, updateOrderStatus } from '../service/OrderService';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toast
import styles from '../Css/OrderDetails.module.css';
import {GetUser} from "../service/UserService";
import jsPDF from "jspdf";
import robotoFont from "../font/Roboto/static/Roboto_Condensed-Regular.ttf";
import "jspdf-autotable";
import {FaPrint, FaTimes} from "react-icons/fa"; // Đảm bảo đã cài đặt: npm install jspdf jspdf-autotable

const OrderDetailPage = () => {
    const { tableId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [paidTables, setPaidTables] = useState([]);
    const [userName, setUserName] = useState(''); // State để lưu userName
    const [isPaid, setIsPaid] = useState(false); // Trạng thái thanh toán
    const handlePayment = () => {
        // Thêm bàn vào danh sách đã thanh toán
        const updatedPaidTables = [...paidTables, Number(tableId)];
        setPaidTables(updatedPaidTables);
        localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));

        // Cập nhật trạng thái bàn đã thanh toán
        setIsPaid(true);

        toast.success('Thanh toán thành công!');
    };
    const handleResetAllStatus = async () => {
        if (!isPaid) {
            toast.error('Bạn chưa thanh toán, vui lòng thực hiện thanh toán trước!');
            return;
        }

        try {
            for (const order of orderDetails) {
                if (!order.status) {
                    await updateOrderStatus(order.oderDetailId);
                }
            }

            setOrderDetails((prevDetails) =>
                prevDetails.map((item) => ({ ...item, status: true }))
            );

            // Xóa trạng thái thanh toán của bàn
            const updatedPaidTables = paidTables.filter(id => id !== Number(tableId));
            setPaidTables(updatedPaidTables);
            localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));

            // Cập nhật state isPaid về false sau khi reset
            setIsPaid(false);

            toast.success('Đã reset bàn thành công!');
            navigate('/user');
        } catch (error) {
            console.error("Error resetting all order statuses:", error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await GetUser(); // Gọi API lấy thông tin người dùng
                if (user) {
                    setUserName(user.username); // Cập nhật tên người dùng
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchUserInfo();
    }, []);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const recordsPerPage = 3; // Số record/trang

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await getOrderDetailsByTable(tableId);
                console.log("Order details:", data); // Kiểm tra dữ liệu trả về
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        const updatePaidTablesFromLocalStorage = () => {
            const paidTableIds = JSON.parse(localStorage.getItem('paidTables')) || [];
            setPaidTables(paidTableIds);
        };

        fetchOrderDetails();
        updatePaidTablesFromLocalStorage();

        window.addEventListener('storage', updatePaidTablesFromLocalStorage);

        return () => {
            window.removeEventListener('storage', updatePaidTablesFromLocalStorage);
        };
    }, [tableId]);


    const handlePaidStatus = () => {
        if (paidTables.includes(Number(tableId))) {
            const updatedPaidTables = paidTables.filter(id => id !== Number(tableId));
            setPaidTables(updatedPaidTables);
            localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));
            toast.success('Đã hủy trạng thái thanh toán bàn!');
        } else {
            const updatedPaidTables = [...paidTables, Number(tableId)];
            setPaidTables(updatedPaidTables);
            localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));
            toast.success('Thanh toán thành công!');
        }
    };
    //
    // const handleResetAllStatus = async () => {
    //     // Kiểm tra xem người dùng đã thanh toán chưa
    //     if (!paidTables.includes(Number(tableId))) {
    //         // Nếu chưa thanh toán, thông báo lỗi và không thực hiện reset
    //         toast.error('Bạn chưa thanh toán, vui lòng thực hiện thanh toán trước!');
    //         return; // Dừng lại không tiếp tục thực hiện
    //     }
    //
    //     try {
    //         // Cập nhật trạng thái của tất cả đơn hàng
    //         for (const order of orderDetails) {
    //             if (!order.status) {
    //                 await updateOrderStatus(order.oderDetailId);
    //             }
    //         }
    //
    //         setOrderDetails((prevDetails) =>
    //             prevDetails.map((item) => ({ ...item, status: true }))
    //         );
    //
    //         // Cập nhật trạng thái thanh toán bàn
    //         const updatedPaidTables = paidTables.includes(Number(tableId))
    //             ? paidTables.filter(id => id !== Number(tableId)) // Nếu bàn đã thanh toán, hủy thanh toán
    //             : [...paidTables, Number(tableId)]; // Nếu bàn chưa thanh toán, thêm vào danh sách bàn đã thanh toán
    //         setPaidTables(updatedPaidTables);
    //         localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));
    //
    //         // Thông báo người dùng
    //         if (paidTables.includes(Number(tableId))) {
    //             toast.success('Đã hủy trạng thái thanh toán bàn!');
    //         } else {
    //             toast.success('Thanh toán thành công!');
    //         }
    //
    //         navigate('/user'); // Điều hướng sau khi reset
    //     } catch (error) {
    //         console.error("Error resetting all order statuses:", error);
    //     }
    // };
    // const handleResetAllStatus = async () => {
    //     if (!paidTables.includes(Number(tableId))) {
    //         toast.error('Bạn chưa thanh toán, vui lòng thực hiện thanh toán trước!');
    //         return;
    //     }
    //
    //     try {
    //         // Cập nhật trạng thái đơn hàng
    //         for (const order of orderDetails) {
    //             if (!order.status) {
    //                 await updateOrderStatus(order.oderDetailId);
    //             }
    //         }
    //
    //         setOrderDetails((prevDetails) =>
    //             prevDetails.map((item) => ({ ...item, status: true }))
    //         );
    //
    //         // Xóa bàn khỏi danh sách đã thanh toán (reset)
    //         const updatedPaidTables = paidTables.filter(id => id !== Number(tableId));
    //         setPaidTables(updatedPaidTables);
    //         localStorage.setItem('paidTables', JSON.stringify(updatedPaidTables));
    //
    //         toast.success('Đã reset bàn thành công!');
    //         navigate('/user'); // Điều hướng sau khi reset
    //     } catch (error) {
    //         console.error("Error resetting all order statuses:", error);
    //     }
    // };

    // Tính tổng giá gốc (số lượng * giá sản phẩm + số lượng * giá topping)
    const totalOriginalPrice = orderDetails.reduce((total, item) => {
        const productPrice = item.product ? item.product.productPrice : 0;
        const sizePrice = item.size ? item.size.price : 0; // Thêm giá của size
        const toppingPrice = item.toppings
            ? item.toppings.reduce((sum, topping) => sum + (topping.price * item.quantity), 0)
            : 0;
        return total + (productPrice * item.quantity) + toppingPrice + (sizePrice * item.quantity);
    }, 0);

    // Lấy tổng tiền sau giảm giá từ field totalMoneyOder của DB
    const totalBill = orderDetails.reduce((total, item) => total + item.totalMoneyOder, 0);

    if (loading) return <p>Loading...</p>;
    // Logic phân trang
    const totalPages = Math.ceil(orderDetails.length / recordsPerPage); // Tổng số trang
    const startIndex = (currentPage - 1) * recordsPerPage; // Vị trí bắt đầu của record
    const currentRecords = orderDetails.slice(startIndex, startIndex + recordsPerPage); // Các record hiển thị trên trang hiện tại

    if (loading) return <p>Loading...</p>;



    return (
        <div className={styles.orderDetailsWrapper}>
            <h2 className={styles.orderDetailsTitle}>Danh sách đơn hàng:</h2>
            {/*<h2 className={styles.userName}>Xin chào, {userName}!</h2>*/}
            {orderDetails.length === 0 ? (
                <p className={styles.orderDetailsEmpty}>Không có đơn hàng nào được đặt.</p>
            ) : (
                <>
                    <div className={styles.orderDetailsList}>
                        {currentRecords.map((item, index) => {
                            const {quantity, product, size, discount, noteProduct, toppings, paymentMethod} = item;
                            const totalPrice = product ? product.productPrice * quantity : 0;
                            const discountAmount = discount ? (totalPrice * discount.value / 100) : 0;
                            const totalAfterDiscount = totalPrice - discountAmount;
                            const toppingDetails = toppings
                                ? toppings.map(topping => `${topping.name} (+${topping.price.toLocaleString("vi-VN")} VND)`).join(", ")
                                : "Không có topping";

                            // Xác định trạng thái thanh toán
                            const paymentStatus = item.callOderRequest?.paymentStatus === "cash"
                                ? "Thanh toán tiền mặt"
                                : item.callOderRequest?.paymentStatus === "transfer"
                                    ? "Chuyển khoản"
                                    : "Không xác định";
                            return (
                                <div className={styles.orderDetailsCard} key={index}>
                                    <h3 className={styles.orderDetailsCardHeader}>Bàn: {item.callOderRequest?.table?.tableName || "Không xác định"}</h3>
                                    <p className={styles.orderDetailsCardText}>Mã hóa
                                        đơn: <strong>{item.callOderRequest?.id || "Không xác định"}</strong></p>
                                    <p className={styles.orderDetailsCardText}>Sản
                                        phẩm: {item.product?.productName || "Không xác định"}</p>
                                    <p className={styles.orderDetailsCardText}>Số lượng: {quantity}</p>
                                    <p className={styles.orderDetailsCardText}>
                                        Giá
                                        tiền: {item.product?.productPrice?.toLocaleString("vi-VN") || "Không xác định"} VND
                                    </p>

                                    <p
                                        className={styles.orderDetailsCardText}>Kích
                                        thước: {size?.sizeName || "Không xác định"}</p>
                                    <p className={styles.orderDetailsCardText}>Ghi
                                        chú: {noteProduct || "Không có ghi chú"}</p>
                                    <p className={styles.orderDetailsCardText}>Giảm
                                        giá: {discount ? `${discount.value}%` : "Không có"}</p>
                                    <p className={styles.orderDetailsCardText}>Topping: {toppingDetails}</p>
                                    <p className={styles.orderDetailsCardText}>Phương thức thanh
                                        toán: <strong>{paymentStatus}</strong></p>

                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.orderDetailsSummary}>
                        <p>Giá gốc: {totalOriginalPrice.toLocaleString("vi-VN")} VND</p>
                        <p>Giảm
                            giá: {orderDetails[0]?.discount?.value ? `${orderDetails[0].discount.value}%` : "Không có giảm giá"}</p>
                        <p>Tổng tiền sau giảm giá: {totalBill.toLocaleString("vi-VN")} VND</p>
                    </div>


                    {/* Phân trang */}
                    <div className={styles.pagination}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Trang trước
                        </button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                            Trang sau
                        </button>
                    </div>

                    <div className={styles.orderDetailsButtonGroup}>
                        <button className={styles.orderDetailsResetButton} onClick={handleResetAllStatus}>Reset Tất Cả
                        </button>
                        <button
                            className={styles.orderDetailsPayButton}
                            onClick={handleOpenModal} // Đảm bảo đúng hàm

                        >
                            Thanh toán
                        </button>
                        {isModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <h2>Xác nhận thanh toán</h2>
                                    <p style={{
                                        fontSize: '1.2rem',
                                        color: '#6d4b3b', /* Màu nâu sáng */
                                        marginBottom: '30px',
                                        textAlign: 'center',
                                        fontFamily: 'Roboto, sans-serif'
                                    }}>
                                        Bạn có muốn in hóa đơn không?
                                    </p>
                                    <div className={styles.modalButtonGroup}>
                                        <button
                                            className={styles.modalButton}
                                            onClick={() => {
                                                handlePayment(); // Gọi hàm thanh toán
                                                handleCloseModal();
                                            }}
                                        >
                                            <FaTimes/> Không in hóa đơn
                                        </button>
                                        <button
                                            className={styles.modalButton}
                                            onClick={() => {
                                                handlePayment(); // Gọi hàm thanh toán
                                                handleCloseModal();
                                                const exportUrl = `/export?orderDetails=${encodeURIComponent(JSON.stringify(orderDetails))}&totalOriginalPrice=${totalOriginalPrice}&totalBill=${totalBill}&userName=${encodeURIComponent(userName)}`;
                                                window.open(exportUrl, '_blank');
                                            }}
                                        >
                                            <FaPrint/> In hóa đơn
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <ToastContainer position="top-center" autoClose={3000}/>
                </>
            )}
        </div>
    );
};

export default OrderDetailPage;
