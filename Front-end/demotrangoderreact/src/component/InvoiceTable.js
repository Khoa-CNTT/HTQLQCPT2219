import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from '../Css/InvoiceSearch.module.css';
import { FaSearch } from 'react-icons/fa';
import {toast} from "react-toastify"; // import icon search
const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false); // flag để biết đang tìm kiếm
    const [modalData, setModalData] = useState(null); // Data cho modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Flag để mở modal
    const [currentCallOrderId, setCurrentCallOrderId] = useState(null);

    const token = localStorage.getItem("token"); // Token được lưu ở localStorage

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/orders/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Dữ liệu trả về từ API:", response.data); // 🔍 Log ở đây

                setInvoices(response.data);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentInvoices = isSearching
    //     ? invoices // hiển thị nguyên mảng trả về (1 phần tử)
    //     : invoices.slice(indexOfFirstItem, indexOfLastItem);
    //
    // const totalPages = isSearching
    //     ? 1
    //     : Math.ceil(invoices.length / itemsPerPage);


    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handleViewDetails = async (callOrderId) => {
        console.log("callOrderId", callOrderId); // Kiểm tra ID gọi lên

        try {
            const response = await axios.get(`http://localhost:8081/api/oder-details/call-order/${callOrderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Dữ liệu chi tiết đơn hàng trả về:", response.data); // Log dữ liệu ở đây
            setCurrentCallOrderId(callOrderId);

            setModalData(response.data); // Set dữ liệu vào modal
            setIsModalOpen(true); // Mở modal
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        }
    };


    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };
    const [filterDate, setFilterDate] = useState(""); // ngày lọc
// Hàm lọc theo ngày nếu có chọn ngày
    const filteredInvoices = filterDate
        ? invoices.filter((invoice) => {
            const date = invoice.oderDetails?.[0]?.shippingDay;
            if (!date) return false;

            // Cắt phần ngày ra từ chuỗi 'YYYY-MM-DD HH:mm:ss.SSSSSS'
            const invoiceDate = date.split(" ")[0]; // "2025-03-05"
            return invoiceDate === filterDate;
        })
        : invoices;


// Xử lý hiển thị dựa theo trạng thái tìm kiếm và lọc
    const currentInvoices = isSearching
        ? filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
        : invoices.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = isSearching
        ? Math.ceil(filteredInvoices.length / itemsPerPage)
        : Math.ceil(invoices.length / itemsPerPage);

    return (
        <div className="p-4">

            <h2 className="text-xl font-bold mb-4">Danh sách hóa đơn</h2>
            <div className={styles.invoiceSearchWrapper}>

                <div className={styles.invoiceSearchContainer}>
                    <input
                        type="text"
                        placeholder="Nhập mã hóa đơn"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className={styles.invoiceInput}
                    />
                    <button
                        onClick={async () => {
                            if (searchId.trim() === "") {
                                // Nếu không nhập gì → load lại tất cả hóa đơn
                                try {
                                    const response = await axios.get("http://localhost:8081/api/orders/all", {
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });
                                    setInvoices(response.data);
                                    setCurrentPage(1);
                                    setIsSearching(false);
                                    toast.info("Đã hiển thị tất cả hóa đơn.");
                                } catch (error) {
                                    console.error("Lỗi khi tải lại danh sách:", error);
                                    toast.error("Không thể tải danh sách hóa đơn.");
                                }
                                return;
                            }

                            // Nếu có dữ liệu trong ô input → thực hiện tìm kiếm
                            try {
                                const response = await axios.get(`http://localhost:8081/api/orders/search?id=${searchId}`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                });

                                if (response.data.content.length === 0) {
                                    toast.info("Không tìm thấy hóa đơn nào.");
                                    setInvoices([]);
                                    setIsSearching(true);
                                } else {
                                    setInvoices(response.data.content);
                                    setIsSearching(true);
                                }
                            } catch (error) {
                                console.error("Lỗi khi tìm kiếm:", error);
                                toast.error("Đã xảy ra lỗi khi tìm kiếm.");
                            }
                        }}
                        className={styles.searchButtono}
                    >
                        <FaSearch className={styles.searchIcono}/>
                        Tìm kiếm
                    </button>


                    {/*<button*/}
                    {/*    onClick={async () => {*/}
                    {/*        try {*/}
                    {/*            const response = await axios.get("http://localhost:8081/api/orders/all", {*/}
                    {/*                headers: {*/}
                    {/*                    Authorization: `Bearer ${token}`,*/}
                    {/*                },*/}
                    {/*            });*/}
                    {/*            setInvoices(response.data);*/}
                    {/*            setCurrentPage(1);*/}
                    {/*            setIsSearching(false);*/}
                    {/*            setSearchId("");*/}
                    {/*        } catch (error) {*/}
                    {/*            console.error("Lỗi khi tải lại danh sách:", error);*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    className={styles.searchButtono}>*/}
                    {/*    Hiển thị tất cả*/}
                    {/*</button>*/}
                </div>
            </div>
            <div className={styles.dateInputWrapper}>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilterDate(value);
                        setCurrentPage(1);

                        if (value === "") {
                            setIsSearching(false);
                        } else {
                            setIsSearching(true);
                        }
                    }}
                    className={styles.dateInput}
                />
            </div>


            <table className={styles.invoiceTable}>
                <thead className={styles.invoiceTableHead}>
                <tr>
                    <th>STT</th>
                    <th>Mã hóa đơn</th>
                    <th>Thanh toán</th>
                    <th>Bàn</th>
                    <th>Ngày</th>
                    <th>Tổng tiền</th>
                    <th>Tác vụ</th>
                </tr>
                </thead>
                <tbody>
                {currentInvoices.map((invoice, index) => (
                    <tr key={invoice.id}>
                        <td>{(currentPage - 1) * 5 + index + 1}</td>
                        <td>{invoice.id}</td>
                        <td>{invoice.paymentStatus}</td>
                        <td>{invoice.table?.tableName || 'Không có'}</td>
                        <td>
                            {invoice.oderDetails?.[0]?.shippingDay
                                ? new Date(invoice.oderDetails[0].shippingDay).toLocaleDateString('vi-VN')
                                : 'N/A'}
                        </td>
                        <td>{invoice.totalPrice.toLocaleString()} VND</td>
                        <td className={styles.actionCell}>
                            <button
                                className={styles.eyeButton}
                                onClick={() => handleViewDetails(invoice.id)} // Gọi API khi nhấn vào con mắt
                            >
                                👁️
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal hiển thị thông tin chi tiết */}
            {isModalOpen && (
                <div className={styles.modalOverlayp}>
                    <div className={styles.modalContentp}>
                        <button className={styles.closeModalButtonp} onClick={closeModal}>
                            X
                        </button>
                        <h2>Chi tiết đơn hàng #{currentCallOrderId}</h2>

                        {modalData?.map((orderDetail, index) => (
                            <div key={index} className={styles.orderDetailp}>
                                {/*<h3>Sản phẩm #{orderDetail.oderDetailId}</h3>*/}
                                <p><strong>Tên sản phẩm:</strong> {orderDetail.product?.productName || "Không có"}</p>
                                <p>
                                    <strong>Giá :</strong>{" "}
                                    {(orderDetail.product?.productPrice + (orderDetail.size?.price || 0)).toLocaleString("vi-VN")} VND
                                </p>
                                <p>
                                    <strong>Kích thước:</strong> {orderDetail.size?.sizeName || "Không có"}
                                </p>

                                <p><strong>Số lượng:</strong> {orderDetail.quantity}</p>
                                <p><strong>Ghi chú:</strong> {orderDetail.noteProduct || "Không có"}</p>
                                <p><strong>Toppings:</strong>
                                    {orderDetail.toppings?.length > 0
                                        ? orderDetail.toppings.map((t, i) => (
                                            <span key={i}>
                                    {t.name} +({t.price?.toLocaleString("vi-VN")} VND){i < orderDetail.toppings.length - 1 ? ', ' : ''}
                                </span>
                                        ))
                                        : "Không có"}
                                </p>
                                <p><strong>Mã khuyến mãi:</strong> {orderDetail.discount?.code || "Không có"}</p>
                                <p><strong>Giá trị giảm:</strong>
                                    {orderDetail.discount?.value != null ? `${orderDetail.discount.value}%` : "Không có"}
                                </p>
                                <p><strong>Tổng tiền:</strong> {orderDetail.totalMoneyOder?.toLocaleString("vi-VN")} VND
                                </p>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {totalPages > 1 && (
                <div className={styles.paginationContainerp}>
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={styles.paginationButtonp}
                    >
                        Trước
                    </button>
                    <span className={styles.pageInfop}>
      Trang {currentPage} / {totalPages}
    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={styles.paginationButtonp}
                    >
                        Sau
                    </button>
                </div>
            )}

            {/*<div className="flex justify-center items-center mt-4 gap-4">*/}
            {/*    <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 bg-gray-300 rounded">*/}
            {/*        Trước*/}
            {/*    </button>*/}
            {/*    <span>Trang {currentPage} / {totalPages}</span>*/}
            {/*    <button onClick={handleNext} disabled={currentPage === totalPages}*/}
            {/*            className="px-3 py-1 bg-gray-300 rounded">*/}
            {/*        Sau*/}
            {/*    </button>*/}
            {/*</div>*/}
            {/*{showModal && selectedInvoice && (*/}
            {/*    <div className={styles.modalOverlayp}>*/}
            {/*        <div className={styles.modalContentp}>*/}
            {/*            <h3 className={styles.modalTitlep}>*/}
            {/*                Chi tiết hóa đơn #{selectedInvoice.id}*/}
            {/*            </h3>*/}
            {/*            {selectedInvoice.oderDetails?.map((od) => (*/}
            {/*                <div key={od.oderDetailId} className={styles.modalDetailItemp}>*/}
            {/*                    <div className={styles.modalFieldp}><strong>Sản phẩm:</strong> {od.product?.productName}</div>*/}
            {/*                    <div className={styles.modalFieldp}><strong>Số lượng:</strong> {od.quantity}</div>*/}
            {/*                    <div className={styles.modalFieldp}><strong>Thành tiền:</strong> {od.totalMoneyOder.toLocaleString()} VND</div>*/}
            {/*                    <div className={styles.modalFieldp}><strong>Ngày:</strong> {new Date(od.shippingDay).toLocaleDateString('vi-VN')}</div>*/}
            {/*                    <div className={styles.modalFieldp}><strong>Ghi chú:</strong> {od.noteProduct || "Không"}</div>*/}

            {/*                    /!* ➕ Size *!/*/}
            {/*                    <div className={styles.modalFieldp}>*/}
            {/*                        <strong>Size:</strong>{" "}*/}
            {/*                        {od.size ? `${od.size.sizeName} - ${od.size.price.toLocaleString()} VND` : "Không"}*/}
            {/*                    </div>*/}

            {/*                    /!* ➕ Topping *!/*/}
            {/*                    <div className={styles.modalFieldp}>*/}
            {/*                        <strong>Topping:</strong>{" "}*/}
            {/*                        {od.toppings && od.toppings.length > 0 ? (*/}
            {/*                            <ul style={{ margin: 0, paddingLeft: "20px" }}>*/}
            {/*                                {od.toppings.map((tp, i) => (*/}
            {/*                                    <li key={i}>{tp.name} - {tp.price.toLocaleString()} VND</li>*/}
            {/*                                ))}*/}
            {/*                            </ul>*/}
            {/*                        ) : (*/}
            {/*                            <span>Không</span>*/}
            {/*                        )}*/}
            {/*                    </div>*/}

            {/*                    /!* Giảm giá *!/*/}
            {/*                    <div className={styles.modalFieldp}>*/}
            {/*                        <strong>Giảm giá:</strong>{" "}*/}
            {/*                        {od.discount ? (*/}
            {/*                            <span>{od.discount.value}%</span>*/}
            {/*                        ) : (*/}
            {/*                            <span>Không</span>*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}

            {/*            <div className={styles.modalFooterp}>*/}
            {/*                <button*/}
            {/*                    onClick={() => {*/}
            {/*                        setShowModal(false);*/}
            {/*                        setSelectedInvoice(null);*/}
            {/*                    }}*/}
            {/*                    className={styles.closeButtonp}*/}
            {/*                >*/}
            {/*                    Đóng*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*const [selectedInvoice, setSelectedInvoice] = useState(null);*/}
            {/*const [showModal, setShowModal] = useState(false);*/}

        </div>
    );
};

export default InvoiceTable;
