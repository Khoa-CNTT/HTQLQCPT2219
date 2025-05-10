import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../Css/ExportPage.module.css";

const ExportPage = () => {
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
    const [totalBill, setTotalBill] = useState(0);
    const [userName, setUserName] = useState("");
    const [tableName, setTableName] = useState(""); // Tên bàn
    const [paymentStatus, setPaymentStatus] = useState(""); // Phương thức thanh toán
    const [invoiceCode, setInvoiceCode] = useState(""); // Mã hóa đơn
    const [currentDate, setCurrentDate] = useState(""); // Ngày hiện tại
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderDetailsData = JSON.parse(decodeURIComponent(params.get("orderDetails")));
        const totalOriginalPriceData = parseFloat(params.get("totalOriginalPrice"));
        const totalBillData = parseFloat(params.get("totalBill"));
        const userNameData = decodeURIComponent(params.get("userName"));

        setOrderDetails(orderDetailsData);
        setTotalOriginalPrice(totalOriginalPriceData);
        setTotalBill(totalBillData);
        setUserName(userNameData);

        // Lấy tên bàn và phương thức thanh toán từ record đầu tiên
        if (orderDetailsData.length > 0) {
            const firstRecord = orderDetailsData[0];
            setTableName(firstRecord.callOderRequest?.table?.tableName || "Không xác định");

            const payment = firstRecord.callOderRequest?.paymentStatus;
            setPaymentStatus(
                payment === "cash"
                    ? "Thanh toán tiền mặt"
                    : payment === "transfer"
                        ? "Chuyển khoản"
                        : "Không xác định"
            );

            // ✅ Lấy mã hóa đơn từ ID của callOderRequest
            setInvoiceCode(firstRecord.callOderRequest?.id || "Không xác định");
        } else {
            setInvoiceCode("Không xác định");
        }

        // Ngày hiện tại
        const date = new Date();
        const formattedDate = date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        setCurrentDate(formattedDate);
    }, [location.search]);
    return (
        <div className={styles.orderDetailsWrapper}>
            {/* Thông tin quán */}
            <div className={styles.shopInfo}>
                <h2 className={styles.shopName}>Coffee House</h2>
                <p className={styles.shopAddress}>Địa chỉ: 331B Nguyễn Hoàng, Hải Châu, TP.Đà Nẵng</p>
                <p className={styles.shopPhone}>SĐT: 0336215616</p>
            </div>

            {/* Thông tin hóa đơn */}
            <h2 className={styles.orderDetailsTitle}>Hóa đơn thanh toán</h2>
            <p className={styles.invoiceCode}>
                Mã hóa đơn: <strong>{invoiceCode}</strong>
            </p>
            <p className={styles.currentDate}>Ngày: <strong>{currentDate}</strong></p>
            <h3 className={styles.userNamee}>UserName: {userName}</h3>
            <p className={styles.tableName}>Bàn: {tableName}</p>
            <p className={styles.paymentStatus}>Phương thức thanh toán: <strong>{paymentStatus}</strong></p>

            {orderDetails.length === 0 ? (
                <p className={styles.orderDetailsEmpty}>Không có đơn hàng nào chưa thanh toán.</p>
            ) : (
                <>
                    <div className={styles.orderDetailsList}>
                        {orderDetails.map((item, index) => {
                            const {quantity, product, size, discount, noteProduct, toppings} = item;
                            const productPrice = product?.productPrice || 0;
                            const sizePrice = size?.price || 0;
                            const basePrice = (productPrice + sizePrice) * quantity;
                            const discountAmount = discount ? (basePrice * discount.value) / 100 : 0;
                            const totalAfterDiscount = basePrice - discountAmount;

                            const toppingDetails = toppings
                                ? toppings.map(topping => `${topping.name} (+${topping.price.toLocaleString("vi-VN")} VND)`).join(", ")
                                : "Không có topping";

                            return (
                                <div className={styles.orderDetailsCard} key={index}>
                                    <p className={styles.orderDetailsCardText}>Sản
                                        phẩm: {product?.productName || "Không xác định"}</p>
                                    <p className={styles.orderDetailsCardText}>Số lượng: {quantity}</p>
                                    <p className={styles.orderDetailsCardText}>
                                        Giá: {basePrice.toLocaleString("vi-VN")} VND
                                    </p>
                                    <p className={styles.orderDetailsCardText}>
                                        Kích thước: {size ? size.sizeName : "Không xác định"}
                                    </p>


                                    <p className={styles.orderDetailsCardText}>Ghi
                                        chú: {noteProduct || "Không có ghi chú"}</p>
                                    <p className={styles.orderDetailsCardText}>Giảm
                                        giá: {discount ? `${discount.value}%` : "Không có"}</p>
                                    <p className={styles.orderDetailsCardText}>Topping: {toppingDetails}</p>
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
                    {/* ✅ Phần cảm ơn khách hàng */}
                    <div className={styles.thankYouMessage}>
                        <p><strong>Xin cảm ơn, hẹn gặp lại quý khách!</strong></p>
                    </div>
                </>
            )}
        </div>
    );
};

    export default ExportPage;
