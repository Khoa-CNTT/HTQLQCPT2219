import React, { useEffect, useState } from "react";
import styles from "../Css/TableList.module.css";
import {BiSearch} from "react-icons/bi";
import * as feedback from "yup";
import {toast} from "react-toastify";

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchDate, setSearchDate] = useState('');  // Lưu trữ ngày tìm kiếm

    // Hàm tải phản hồi
    const loadFeedbacks = async (pageNumber = 0) => {
        try {
            const token = localStorage.getItem("token");
            let url = `http://localhost:8081/api/feedback?page=${pageNumber}&size=4`;

            // Nếu có ngày tìm kiếm, thêm tham số ngày vào URL
            if (searchDate) {
                url = `http://localhost:8081/api/feedback/searchByDate?date=${searchDate}&page=${pageNumber}&size=4`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Không lấy được phản hồi");

            const data = await response.json();
            setFeedbacks(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải phản hồi:", error);
        }
    };

    // Gọi hàm loadFeedbacks mỗi khi thay đổi page hoặc searchDate
    useEffect(() => {
        loadFeedbacks(page);
    }, [page, searchDate]);  // Cập nhật khi thay đổi ngày hoặc trang

    // Hàm xử lý chuyển trang tiếp theo
    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage(prev => prev + 1);
        }
    };

    // Hàm xử lý chuyển trang trước
    const handlePrev = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    };

    // Hàm format lại ngày hiển thị cho dễ đọc
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Kết quả: 06/04/2025
    };

    return (
        <div className={styles.containeri}>
            <h2 className={styles.headerTextt1}>Danh sách phản hồi</h2>
            <div className={styles.searchContainer112}>
                <input
                    type="date"  // Định dạng input là ngày
                    className={styles.searchInput112}
                    placeholder="Chọn ngày"
                    value={searchDate}  // Gắn giá trị ngày chọn
                    onChange={(e) => {
                        setSearchDate(e.target.value);
                        setPage(0);  // Reset lại trang về 0 khi thay đổi ngày
                    }}  // Cập nhật state khi người dùng chọn ngày
                />
            </div>
            <table className={styles.table1}>
                <thead>
                <tr>
                    <th style={{width: "70px", textAlign: "center"}}>STT</th>
                    <th style={{width: "70px", textAlign: "center"}}>Rating</th>
                    <th style={{width: "150px"}}>Người đánh giá</th>
                    <th style={{width: "100%", textAlign: "center"}}>Nội dung</th>
                    <th style={{whiteSpace: "nowrap"}}>Ngày</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.length > 0 ? feedbacks.map((fb, index) => {
                    console.log("🧾 Ngày phản hồi nhận được từ API:", fb.date);
                    return (
                        <tr key={fb.id}>
                            <td style={{width: "70px", textAlign: "center"}}>{page * 4 + index + 1}</td>
                            <td style={{width: "70px", textAlign: "center"}}>{fb.rating}</td>
                            <td style={{width: "150px"}}>{fb.reviewerName || "Ẩn danh"}</td>
                            <td style={{
                                width: "100%",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                            }}>
                                {fb.content}
                            </td>
                            <td style={{whiteSpace: "nowrap"}}>{formatDate(fb.date)}</td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan="5">Không có phản hồi nào</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className={styles.paginationContainert1}>
                <button className={styles.paginationButtont1} onClick={handlePrev} disabled={page === 0}>Trước
                </button>
                <span className={styles.pageInfot1}>Trang {page + 1} / {totalPages}</span>
                <button className={styles.paginationButtont1} onClick={handleNext}
                        disabled={page >= totalPages - 1}>Sau
                </button>
            </div>
        </div>
    );
};

export default FeedbackList;
