import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useRef } from "react";
import styles from "../Css/PaymentStatusPage.module.css";
import response from "sockjs-client/lib/event/trans-message";
import Modal1 from "react-modal";
import {FaStar} from "react-icons/fa";
import styles1 from '../Css/TableDetails.module.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState("");
    const isOrderPlacedRef = useRef(false); // Sử dụng useRef để kiểm soát trạng thái
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // State mở modal đánh giá
    const [callOrderId, setCallOrderId] = useState(null); // Lưu ID đơn hàng để gửi đánh giá
    const [rating, setRating] = useState(0); // Đánh giá mặc định
    const [content, setContent] = useState(""); // Bình luận của khách hàng
    useEffect(() => {
        const responseCode = searchParams.get("vnp_ResponseCode");
        const amount = searchParams.get("vnp_Amount") / 100; // Chuyển về đơn vị VNĐ
        const orderInfo = searchParams.get("vnp_OrderInfo");
        const bankCode = searchParams.get("vnp_BankCode");

        // Kiểm tra trạng thái và chỉ gọi API nếu chưa xử lý
        if (responseCode === "00" && !isOrderPlacedRef.current) {
            isOrderPlacedRef.current = true; // Đánh dấu đã xử lý
            const orderData = JSON.parse(localStorage.getItem("orderData"));

            const placeOrder = async () => {
                try {
                    const response = await axios.post(
                        "http://localhost:8081/api/orders/place",
                        orderData,
                        { headers: { "Content-Type": "application/json" } } // Đảm bảo gửi JSON
                    );
                    console.log("Full API Response:", response); // Kiểm tra toàn bộ response

                    if (response.data && response.data.id) {
                        setCallOrderId(response.data.id);
                        setIsFeedbackModalOpen(true); // Mở modal đánh giá
                    } else {
                        console.warn("API không trả về ID đơn hàng, modal sẽ không mở.");
                    }

                    const paidTables = JSON.parse(localStorage.getItem("paidTables")) || [];
                    if (!paidTables.includes(orderData.table.tableId)) {
                        paidTables.push(orderData.table.tableId);
                        localStorage.setItem("paidTables", JSON.stringify(paidTables));
                    }

                    toast.success("Đơn hàng đã được xử lý thành công!");
                    setPaymentStatus({
                        status: "success",
                        message: `Thanh toán thành công!`,
                        amount,
                        orderInfo,
                        bankCode,
                    });
                } catch (error) {
                    console.error("Lỗi khi xử lý đơn hàng:", error);
                    toast.error("Có lỗi xảy ra khi xác nhận đơn hàng.");
                    setPaymentStatus({
                        status: "failed",
                        message: `Thanh toán thất bại. Có lỗi xảy ra khi xử lý đơn hàng.`,
                    });
                }
            };

            placeOrder();
        } else if (!isOrderPlacedRef.current && responseCode !== "00") {
            setPaymentStatus({
                status: "failed",
                message: `Thanh toán thất bại. Mã lỗi: ${responseCode}`,
            });
        }
    }, []); // Lưu ý: Không thêm `searchParams` vào dependencies để tránh chạy lại
    useEffect(() => {
        console.log("isFeedbackModalOpen changed:", isFeedbackModalOpen);
    }, [isFeedbackModalOpen]);
    const [reviewerName, setReviewerName] = useState("");

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



        console.log("🟢 Dữ liệu gửi lên server:", feedbackData);

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
        } catch (error) {
            console.error("🔴 Lỗi khi gửi đánh giá:", error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    return (
        <div className={styles.containerPayment}>
            {paymentStatus.status === "success" ? (
                <div className={`${styles.resultContainer} ${styles.successContainer}`}>
                    <h1 className={`${styles.resultTitle} ${styles.successTitle}`}>Thanh toán thành công</h1>
                    <div className={styles.resultDetail}>
                        <p>
                            <span className={styles.resultLabel}>Số tiền:</span> {paymentStatus.amount} VNĐ
                        </p>
                        <p>
                            <span className={styles.resultLabel}>Nội dung đơn hàng:</span> {paymentStatus.orderInfo}
                        </p>
                        <p>
                            <span className={styles.resultLabel}>Ngân hàng:</span> {paymentStatus.bankCode}
                        </p>
                    </div>
                    <button
                        className={`${styles.resultButton} ${styles.successButton}`}
                        onClick={() => (window.location.href = "/home")}
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            ) : (
                <div className={`${styles.resultContainer} ${styles.errorContainer}`}>
                    <h1 className={`${styles.resultTitle} ${styles.errorTitle}`}>Thanh toán thất bại</h1>
                    <p className={styles.resultDetail}>{paymentStatus.message}</p>
                    <button
                        className={`${styles.resultButton} ${styles.errorButton}`}
                        onClick={() => (window.location.href = "/")}
                    >
                        Thử lại
                    </button>
                </div>
            )}
            {/* Modal đánh giá */}
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
                    <button onClick={() => setIsFeedbackModalOpen(false)} className={styles["cancelButtonhx"]}>
                        Hủy
                    </button>
                </div>
            </Modal1>

        </div>
    );
};


export default PaymentSuccess;
