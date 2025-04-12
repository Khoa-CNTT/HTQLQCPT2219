import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { getAllTables } from '../service/TableService';
import { Modal } from 'antd';
import styles from '../Css/TableAdmin.module.css'; // Import CSS Module
import {getAllOderDetails} from "../service/OderdetailService";
import OrderDetailList from "./OrderDetailList";
import { faChair, faHistory, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {GetUser} from "../service/UserService";
import { logout } from '../service/UserService';
import {ToastContainer} from "react-toastify"; // Đường dẫn tới file authService.js
import 'react-toastify/dist/ReactToastify.css';

const TableListAdmin = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paidTables, setPaidTables] = useState([]);
    const [isPaidModalVisible, setIsPaidModalVisible] = useState(false); // Modal cho bàn thanh toán
    const [paidModalContent, setPaidModalContent] = useState(''); // Nội dung modal cho thanh toán
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false); // Modal cho gọi phục vụ
    const [serviceModalContent, setServiceModalContent] = useState(''); // Nội dung modal cho gọi phục vụ
    const [serviceRequests, setServiceRequests] = useState([]);
// Hàng đợi thông báo và trạng thái xử lý
    const [notificationQueue, setNotificationQueue] = useState([]);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);
    const [userName, setUserName] = useState(''); // State để lưu userName
    const [imageUrl, setImageUrl] = useState(''); // State để lưu imageUrl
    const [isOrderHistoryVisible, setIsOrderHistoryVisible] = useState(false); // Trạng thái hiển thị lịch sử đơn hàng
    const [orderDetails, setOrderDetails] = useState([]);
    const [showTableList, setShowTableList] = useState(true); // State để điều khiển hiển thị danh sách bàn hay lịch sử hóa đơn
    const navigate = useNavigate();  // Hook dùng để điều hướng về trang khác

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await GetUser(); // Gọi API lấy thông tin người dùng
                if (user) {
                    setUserName(user.username); // Cập nhật tên người dùng
                    setImageUrl(user.imgUrl); // Cập nhật URL ảnh đại diện
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false); // Dừng trạng thái loading
            }
        };

        fetchUserInfo();
    }, []);

    // Hàm fetch dữ liệu bàn
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
    // Hàm gọi API lấy order details
    const fetchOrderDetails = async () => {
        try {
            const data = await getAllOderDetails(); // Gọi API để lấy dữ liệu
            setOrderDetails(data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
    const toggleTableList = () => {
        setIsOrderHistoryVisible(false); // Ẩn lịch sử hóa đơn
    };

    const toggleOrderHistory = () => {
        setIsOrderHistoryVisible(true); // Hiển thị lịch sử hóa đơn
    };
    useEffect(() => {
        // Giả sử bạn đã có các hàm để lấy danh sách bàn và người dùng
        fetchOrderDetails(); // Gọi API để lấy dữ liệu order
    }, []);

    // Cập nhật paidTables từ localStorage
    const updatePaidTablesFromLocalStorage = () => {
        const paidTableIds = JSON.parse(localStorage.getItem('paidTables')) || [];
        const newPaidTables = paidTableIds.filter((tableId) => !paidTables.includes(tableId)); // Lọc các bàn mới thanh toán

        if (newPaidTables.length > 0) {
            // Lấy tên các bàn mới thanh toán
            const newNotifications = newPaidTables.map((tableId) => {
                const table = tables.find((t) => t.tableId === tableId);
                const tableName = table ? table.tableName : `Bàn ${tableId}`;
                return ` ${tableName} vừa đặt hàng!`;
            });

            // Thêm thông báo vào hàng đợi
            notificationQueue.push(...newNotifications);

            // Nếu không có thông báo nào đang hiển thị, bắt đầu xử lý hàng đợi
            if (!isProcessingQueue) {
                processNotificationQueue();
            }

            // Cập nhật danh sách bàn đã thanh toán
            setPaidTables(paidTableIds);
        }
    };
    // Hàm xử lý thông báo lần lượt trong hàng đợi
    const processNotificationQueue = () => {
        if (notificationQueue.length > 0) {
            setIsProcessingQueue(true);
            const currentNotification = notificationQueue.shift(); // Lấy thông báo đầu tiên
            setPaidModalContent(currentNotification);
            setIsPaidModalVisible(true);
        } else {
            setIsProcessingQueue(false);
        }
    };
    const PRIORITY_MAP = {
        "gọi phục vụ": 1,
        "đổi món": 2,
        "tính tiền": 3
    };


    const [currentNotification, setCurrentNotification] = useState(null);

    const checkServiceRequests = () => {
        const requests = JSON.parse(localStorage.getItem('serviceRequests')) || [];

        if (requests.length > 0) {
            const newQueue = requests.map(({ id, type }) => {
                const lowerType = type.toLowerCase(); // ✅ đảm bảo khớp key
                const table = tables.find((t) => t.tableId === id);
                const tableName = table ? table.tableName : `Bàn ${id}`;
                return {
                    id,
                    type,
                    message: `${tableName} vừa yêu cầu "${type}"`,
                    priority: PRIORITY_MAP[lowerType] || 99
                };
            });

            console.log("🆕 Yêu cầu mới: ", newQueue);

            // ✅ Gộp với hàng đợi cũ và sort luôn theo độ ưu tiên
            setNotificationQueue(prev => {
                const merged = [...prev, ...newQueue];
                const sorted = merged.sort((a, b) => a.priority - b.priority); // 👈 sort luôn ở đây
                console.log("📋 Hàng đợi sau khi gộp và sort: ", sorted);
                return sorted;
            });

            localStorage.setItem('serviceRequests', JSON.stringify([]));
        }
    };
    useEffect(() => {
        fetchTables();
        const interval = setInterval(checkServiceRequests, 1000);
        window.addEventListener('storage', updatePaidTablesFromLocalStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', updatePaidTablesFromLocalStorage);
        };
    }, []);

    useEffect(() => {
        if (notificationQueue.length === 0) return;

        const sortedQueue = [...notificationQueue].sort((a, b) => a.priority - b.priority);
        const nextNotification = sortedQueue[0];

        // Trường hợp chưa có notification nào đang hiển thị
        if (!currentNotification) {
            setCurrentNotification(nextNotification);
            setNotificationQueue((prev) =>
                prev.filter(item => !(item.id === nextNotification.id && item.type === nextNotification.type))
            );
            setIsServiceModalVisible(true);
            console.log("🔔 Hiển thị notification (mới): ", nextNotification);
        }

        // ✅ Trường hợp đang hiển thị 1 thông báo, nhưng có cái mới ưu tiên hơn
        else if (nextNotification.priority < currentNotification.priority) {
            // Cho phép thay thế ngay lập tức
            setCurrentNotification(nextNotification);
            setNotificationQueue((prev) =>
                [...prev, currentNotification] // đẩy cái cũ lại vào hàng đợi
                    .filter(item => !(item.id === nextNotification.id && item.type === nextNotification.type))
            );
            setIsServiceModalVisible(true);
            console.log("🔁 Thay thế notification đang hiển thị bằng cái ưu tiên hơn: ", nextNotification);
        }

    }, [notificationQueue, currentNotification]);











    useEffect(() => {
        // Lấy userName từ token

        fetchTables();
        const interval = setInterval(checkServiceRequests, 1000); // Kiểm tra yêu cầu mỗi giây

        // Cập nhật paidTables từ localStorage
        updatePaidTablesFromLocalStorage();

        // Lắng nghe sự thay đổi của localStorage (chỉ áp dụng với window)
        window.addEventListener('storage', updatePaidTablesFromLocalStorage);

        // Dọn dẹp khi component unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', updatePaidTablesFromLocalStorage);
        };
    }, []); // Chỉ chạy lần đầu khi component mount
// Đóng modal và hiển thị thông báo tiếp theo
    const closePaidModal = () => {
        setIsPaidModalVisible(false);
        processNotificationQueue();
    };
    // Kiểm tra loading
    if (loading) return <p>Loading...</p>;

    return (
        <div style={{position: 'relative', height: '100vh', width: '100vw'}}>
            {/* Ảnh nền */}
            <div className={styles.backgroundOverlay}></div>

            {/* Header */}

            <header className={styles.header}>
                <div className={styles.userInfo}>
                    {imageUrl && (
                        <Link to="/edit-user">
                            <img src={imageUrl} alt="User Avatar" className={styles.userAvatar}/>
                        </Link>
                    )}
                    <h2 className={styles.userName}>Xin chào, {userName}!</h2>
                </div>
                <nav className={styles.navbar}>
                    <button onClick={toggleTableList} className={styles.navItem}>
                        <FontAwesomeIcon icon={faChair} className={styles.icon}/> Danh sách bàn
                    </button>
                    <button onClick={toggleOrderHistory} className={styles.navItem}>
                        <FontAwesomeIcon icon={faHistory} className={styles.icon}/> Lịch sử hóa đơn
                    </button>
                    {/* Nút Đăng xuất */}
                    <button onClick={logout} className={styles.navItem}>
                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon}/> Đăng xuất
                    </button>
                </nav>
            </header>


            {/* Nội dung */}
            {/* Nội dung */}
            <div style={{marginTop: '100px'}}>
                {isOrderHistoryVisible ? (
                    // Nếu hiển thị Lịch sử hóa đơn
                    <div>
                        <OrderDetailList orderDetails={orderDetails}/> {/* Hiển thị danh sách đơn hàng */}
                    </div>
                ) : (
                    // Nếu hiển thị Danh sách bàn
                    <div className={styles.tableGrid}>
                        {tables.map((table) => (
                            <Link
                                key={table.tableId}
                                to={`/order/${table.tableId}`}
                                className={styles.tableLink}
                            >
                                <div
                                    className={`${styles.tableCard} ${
                                        paidTables.includes(table.tableId) ? styles.paid : ''
                                    }`}
                                >
                                    {table.tableName}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>


            {/* Modal thanh toán */}
            <Modal
                title={<div className={styles.modalTitle}>Thông Báo</div>}
                visible={isPaidModalVisible}
                onOk={closePaidModal}
                footer={[
                    <button
                        key="ok"
                        className={styles.modalButton}
                        onClick={closePaidModal}
                    >
                        OK
                    </button>,
                ]}
            >
                <div className={styles.modalContainer}>
                    <p className={styles.modalContent}>{paidModalContent}</p>
                </div>
            </Modal>

            {/* Modal gọi phục vụ */}
            <Modal
                title="Thông Báo Gọi Phục Vụ"
                visible={isServiceModalVisible}
                onOk={() => {
                    setIsServiceModalVisible(false);
                    setCurrentNotification(null);
                }}
                footer={[
                    <button
                        key="ok"
                        className={styles.modalButton}
                        onClick={() => {
                            setIsServiceModalVisible(false);
                            setCurrentNotification(null);
                        }}
                    >
                        OK
                    </button>
                ]}
            >
                <div className={styles.modalContainer}>
                    <p className={styles.modalContent}>{currentNotification?.message}</p>
                </div>
            </Modal>


            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default TableListAdmin;
