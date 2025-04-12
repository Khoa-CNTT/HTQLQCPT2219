import React, { useEffect, useState } from 'react';
import { getAllOderDetails } from '../service/OderdetailService';
import styles from '../Css/OrderDetailList.module.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const OrderDetailList = () => {
    const [oderDetails, setOderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 2;

    const fetchOrderDetails = async () => {
        try {
            const data = await getAllOderDetails();
            console.log("Dữ liệu từ API:", data);

            // Sắp xếp dữ liệu ngay sau khi lấy từ API
            const sortedData = data.sort((a, b) =>
                new Date(b.shippingDay.replace(" ", "T")) - new Date(a.shippingDay.replace(" ", "T"))
            );

            console.log("Dữ liệu sau khi sắp xếp:", sortedData);
            setOderDetails(sortedData);
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);



    if (loading) {
        return <div className={styles.loadingSpinner}>Loading...</div>;
    }

    const totalPages = Math.ceil(oderDetails.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = oderDetails.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const renderPageNumbers = () => {
        const maxPageNumbersToShow = 5; // Số nút trang tối đa hiển thị
        let startPage = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
        let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

        // Điều chỉnh để không vượt quá tổng số trang
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
                >
                    {i}
                </button>
            );
        }

        // Chèn dấu `...` nếu cần
        if (startPage > 1) {
            pageNumbers.unshift(
                <button key="prevEllipsis" className={styles.pageButton} disabled>
                    ...
                </button>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(
                <button key="nextEllipsis" className={styles.pageButton} disabled>
                    ...
                </button>
            );
        }

        return pageNumbers;
    };
    console.log(currentRecords.map(order => order.shippingDay));

    return (
        <div className={styles.orderDetailContainer}>
            <h1 className={styles.orderDetailTitle}>Lịch sử hóa đơn</h1>
            {[...currentRecords]
                .sort((a, b) => {
                    return new Date(b.shippingDay.replace(" ", "T")) - new Date(a.shippingDay.replace(" ", "T"));
                })                // Sắp xếp giảm dần theo ngày
                .map((order) => (
                    <div key={order.oderDetailId} className={styles.orderDetailCard}>
                    <div className={styles.orderDetailHeader}>
                        {order.callOderRequest?.table?.tableName}
                    </div>
                        <div className={styles.orderDetailContent}>
                            {/* Mã hóa đơn */}
                            <div>
                                <span className={styles.orderDetailLabel}>Mã hóa đơn: </span>
                                {order.callOderRequest?.id || "Không xác định"}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Product Name: </span>
                                {order.product?.productName || "Không có thông tin sản phẩm"}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Product price: </span>
                                {order.product?.productPrice
                                    ? `${order.product.productPrice.toLocaleString("vi-VN")} VND`
                                    : "Không rõ giá"}
                            </div>

                            <div>
                                <span className={styles.orderDetailLabel}>Quantity: </span>
                                {order.quantity}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Size: </span>
                                {order.size?.sizeName || "Không rõ size"}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Toppings: </span>
                                {(order.toppings || []).length > 0
                                    ? order.toppings.map((topping) => topping.name).join(', ')
                                    : 'No toppings'}

                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Discount: </span>
                                {order.discount ? `${order.discount.value}%` : 'No discount'}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Note Product: </span>
                                {order.noteProduct || 'No notes'}
                            </div>
                            <div>
                                <span className={styles.orderDetailLabel}>Shipping Day: </span>
                                {order.shippingDay}
                            </div>
                            {/* Hiển thị phương thức thanh toán */}
                            <div>
                                <span className={styles.orderDetailLabel}>Payment Method: </span>
                                {order.callOderRequest?.paymentStatus === 'cash'
                                    ? 'Thanh toán tiền mặt'
                                    : order.callOderRequest?.paymentStatus === 'transfer'
                                        ? 'Thanh toán chuyển khoản'
                                        : 'No payment method'}
                            </div>

                        </div>
                        <div className={styles.orderDetailFooter}>
                            <div>
                            <span className={styles.orderDetailLabel}><strong>Giá gốc:</strong> </span>
                                <strong>
                                {(
                                    (order.product?.productPrice || 0) * order.quantity +
                                    (order.size?.price || 0) * order.quantity +
                                    (order.toppings?.reduce((sum, topping) => sum + topping.price, 0) * order.quantity || 0)
                                ).toLocaleString("vi-VN")} VND
                            </strong>
                        </div>

                        <div>
                            <span className={styles.orderDetailLabel}><strong>Total Price:</strong> </span>
                            <strong>{order.totalMoneyOder.toLocaleString("vi-VN")} VND</strong>
                        </div>


                    </div>
                </div>
            ))}

            <div className={styles.pagination}>
                <button
                    onClick={prevPage}
                    className={`${styles.pageButton} ${styles.pageButtonPrev}`}
                    disabled={currentPage === 1}
                >
                    <FaArrowLeft className={styles.pageButtonIcon}/>
                </button>
                {renderPageNumbers()}
                <button
                    onClick={nextPage}
                    className={`${styles.pageButton} ${styles.pageButtonNext}`}
                    disabled={currentPage === totalPages}
                >
                    <FaArrowRight className={styles.pageButtonIcon} />
                </button>
            </div>
        </div>
    );
};

export default OrderDetailList;
