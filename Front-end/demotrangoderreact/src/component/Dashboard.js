import UserList from "./Employee/ListUser"; // Import trang danh sách nhân viên

import {useEffect, useState} from "react";
import {
    FaUsers,
    FaBox,
    FaClipboardList,
    FaComments,
    FaMoneyBill,
    FaChartPie,
    FaChair,
    FaUserPlus,
    FaUserEdit,
    FaUserMinus,
    FaPlusCircle,
    FaEdit,
    FaTrash,
    FaEnvelopeOpenText,
    FaRegEdit,
    FaTools,
    FaMoneyBillWave,
    FaFileInvoiceDollar,
    FaGift,
    FaTags,
    FaCoffee,
    FaStore,
    FaLeaf,
    FaClipboard,
    FaConciergeBell,
    FaCogs, FaIceCream, FaCog, FaSlidersH, FaSync
} from "react-icons/fa";
import styles from "../Css/Dashboard.module.css";
import {BarChart, Bar, XAxis, YAxis, Tooltip, Line, CartesianGrid, LineChart, AreaChart, Area} from 'recharts';
import {GetUser, logout} from "../service/UserService";
import {FiLogOut} from "react-icons/fi";
import AddEmployeeForm from "./Employee/AddUser";
import UpdateUser from "./Employee/UpdateUser";
import CategoryManagement from "./CategoryManagement";
import CategoryForm from "./AddCategory";
import ProductList from "./ProductList";
import TableManager from "./Table/TableManager";
import FeedbackList from "./FeedbackList";
import IncomeManager from "./IncomeManager";
import InvoiceTable from "./InvoiceTable";
import DiscountList from "./DiscountList";
import {RiDashboardLine} from "react-icons/ri";
import axios from "axios";
import { Link } from "react-router-dom";
import IngredientList from "./IngredientList";
import * as lowStockRes from "framer-motion/m";
import ProductIngredientList from "./ProductIngredientList";
import ToppingIngredientList from "./ToppingIngredientList";
import ToppingList from "./ToppingList";

const Dashboard = () => {
    const [selected, setSelected] = useState(["", ""]); // [Danh mục cha, Danh mục con]
    const [expanded, setExpanded] = useState(null); // Mục nào đang mở submenu
    const [user, setUser] = useState(null);
    const [isAdding, setIsAdding] = useState(false); // Kiểm soát trạng thái hiển thị
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedUserId, setSelectedUserId] = useState(null); // Lưu trữ userId khi chỉnh sửa
    const [productKey, setProductKey] = useState(0);
    const today = new Date();
    const [time, setTime] = useState(today.toLocaleTimeString('vi-VN'));
    const date = today.toLocaleDateString('vi-VN');
    const [lowIngredients, setLowIngredients] = useState([]);
    const [showIngredientWarning, setShowIngredientWarning] = useState(false);
    useEffect(() => {
        const checkLowIngredients = async () => {
            try {
                const token = localStorage.getItem("token"); // hoặc sessionStorage nếu bạn dùng cái đó

                const response = await axios.get('http://localhost:8081/api/ingredients/low-stock', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (response.data.length > 0) {
                    console.log("Dữ liệu lowStock:", lowStockRes.data);
                    setLowIngredients(response.data);
                    setShowIngredientWarning(true);
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra nguyên liệu:", error);
            }
        };

        checkLowIngredients();
    }, []);


    useEffect(() => {
        if (!selected[0]) {
            setSelected(["Trang Chủ", null]); // hoặc ["default", null]
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString('vi-VN'));
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Cleanup khi unmount
    }, []);
    const [orderCount, setOrderCount] = useState(0);
    const [dailyIncome, setDailyIncome] = useState(0);
    const [hourlyIncome, setHourlyIncome] = useState([]);
    const [monthlyOrderCount, setMonthlyOrderCount] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkLowIngredients = async () => {
            try {
                const token = localStorage.getItem("token");

                // Gọi API lấy danh sách nguyên liệu gần hết
                const lowStockRes = await axios.get('http://localhost:8081/api/ingredients/low-stock', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log("📦 Dữ liệu từ /low-stock:", lowStockRes.data);

                // Gọi API lấy tất cả nguyên liệu
                const allIngredientsRes = await axios.get('http://localhost:8081/api/ingredients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log("📦 Dữ liệu từ /ingredients:", allIngredientsRes.data);

                // Kiểm tra dữ liệu có phải mảng không
                const lowStockList = Array.isArray(lowStockRes.data) ? lowStockRes.data : [];
                const allIngredients = Array.isArray(allIngredientsRes.data) ? allIngredientsRes.data : [];

                // Tìm nguyên liệu chi tiết trùng id
                const lowDetailed = allIngredients.filter(ingredient =>
                    lowStockList.some(low => low.id === ingredient.id)
                );

                console.log("✅ Danh sách nguyên liệu gần hết (đã chi tiết):", lowDetailed);

                if (lowDetailed.length > 0) {
                    setLowIngredients(lowDetailed);
                    setShowIngredientWarning(true);
                }

            } catch (error) {
                console.error("❌ Lỗi khi kiểm tra nguyên liệu:", error);
            }
        };

        checkLowIngredients();
    }, []);

    const handleEdit = (userId) => {
        // console.log('User ID for edit:', userId); // Kiểm tra giá trị userId
        setSelectedUserId(userId); // Lưu userId vào state
    };
    const handleCancel = () => {
        setSelectedUserId(null);  // Reset lại selectedUserId
        setIsAdding(false);       // Đóng form thêm nhân viên nếu có
    };

    // console.log('Selected UserId:', selectedUserId); // Để kiểm tra userId trong Dashboard
    // useEffect(() => {
    //     console.log('UserId changed to:', selectedUserId);
    // }, [selectedUserId]); // Khi selectedUserId thay đổi, sẽ log lại để kiểm tra

    useEffect(() => {
        if (selected[0] === "Quản Lý Nhân Viên" && selected[1] === "Tạo và quản lý nhân viên") {
            setIsAdding(false); // Reset về UserList khi vào lại trang
            setRefreshKey(prev => prev + 1); // Cập nhật key để UserList render lại
        }
    }, [selected]);
    const [userName, setUserName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await GetUser();
                console.log("Dữ liệu trả về từ API:", userData);
                if (userData) {
                    setUserName(userData.fullName); // Sử dụng fullName hoặc username tùy theo API
                    setImageUrl(userData.imgUrl);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    // Danh sách menu với mục con
    const menuItems = [
        {
            name: "Quản Lý Nhân Viên",
            icon: <FaUsers />,
            subItems: [
                // { name: "Thêm Nhân Viên", icon: <FaUserPlus /> },
                { name: "Tạo và quản lý nhân viên", icon: <FaUserEdit /> },
                // { name: "Xóa Nhân Viên", icon: <FaUserMinus /> }
            ]
        },
        {
            name: "Quản Lý Danh Mục",
            icon: <FaBox />,
            subItems: [
                { name: "Quản lý nhóm món", icon: <FaEdit /> },
            ]
        },
        {
            name: "Quản Lý Sản Phẩm",
            icon: <FaClipboardList />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Chỉnh Sửa Sản Phẩm", icon: <FaRegEdit  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        }, {
            name: "Quản lý Phụ liệu",
            icon: <FaSlidersH   />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Chỉnh Sửa phụ liệu", icon: <FaSync   /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },{
            name: `Quản Lý Nguyên Liệu${lowIngredients.length > 0 ? ' ⚠️' : ''}`,
            icon: <FaLeaf  />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Chỉnh Sửa Nguyên Liệu", icon: <FaClipboard  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },{
            name: "Quản Lý Công Thức Món",
            icon: <FaConciergeBell  />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Thiết Lập Thành Phần", icon: <FaCogs   /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        }, {
            name: "Thiết Lập Cho Phụ Liệu",
            icon: <FaIceCream  />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Cấu Hình Phụ Liệu", icon: <FaCog  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },
        {
            name: "Quản Lý Bàn",
            icon: <FaChair />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Chỉnh Sửa Bàn", icon: <FaTools  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        }, {
            name: "Quản Lý Khuyến Mãi",
            icon: <FaGift  />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Chỉnh Sửa Khuyến Mãi", icon: <FaTags  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },
        {
            name: "Quản lý phản hồi",
            icon: <FaComments />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Xem phản hồi", icon: <FaEnvelopeOpenText /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },

        {
            name: "Quản Lý Hóa Đơn",
            icon: <FaFileInvoiceDollar  />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Xem Hóa Đơn", icon: <FaClipboardList  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },{
            name: "Thống Kê",
            icon: <FaChartPie />,
            subItems: [
                // { name: "Thêm Sản Phẩm", icon: <FaPlusCircle /> },
                { name: "Tính Thu Nhập", icon: <FaMoneyBillWave  /> },
                // { name: "Xóa Sản Phẩm", icon: <FaTrash /> }
            ]
        },
    ];

    const handleMenuClick = (item) => {
        // Chỉ chọn danh mục cha
        setSelected([item.name, ""]);

        // Reset các trạng thái khi thay đổi menu
        setSelectedUserId(null);  // Reset lại selectedUserId khi chọn lại menu
        setIsAdding(false);       // Đảm bảo không có modal AddEmployeeForm khi chọn lại menu

        if (item.subItems) {
            setExpanded(expanded === item.name ? null : item.name);
        } else {
            setExpanded(null);
        }
    };
    const handleMenuClickP = (main, sub) => {
        setSelected([main, sub]);
        setSelectedUserId(null);
        setIsAdding(false);

        if (main === "Quản Lý Sản Phẩm" && sub === "Chỉnh Sửa Sản Phẩm") {
            setProductKey(prev => prev + 1);
        }
        if (main === "Quản Lý Bàn" && sub === "Chỉnh Sửa Bàn") {
            setRefreshKey(prev => prev + 1); // Reload lại trang TableManager
        }
        if (main === "Quản lý phản hồi" && sub === "Xem phản hồi") {
            setRefreshKey(prev => prev + 1); // Reload lại trang TableManager
        }
        if (main === "Thống Kê") {
            setRefreshKey(prev => prev + 1); // Reload lại trang TableManager
        }
        if (main === "Quản Lý Hóa Đơn") {
            setRefreshKey(prev => prev + 1); // Reload lại trang TableManager
        }
        if (main === "Quản Lý Khuyến Mãi") {
            setRefreshKey(prev => prev + 1); // Reload lại trang TableManager
        }
        if (main?.startsWith("Quản Lý Nguyên Liệu")) {
            setRefreshKey(prev => prev + 1);
        }
        if (main?.startsWith("Quản Lý Công Thức Món")) {
            setRefreshKey(prev => prev + 1);
        }
        if (main?.startsWith("Thiết Lập Cho Phụ Liệu")) {
            setRefreshKey(prev => prev + 1);
        }  if (main?.startsWith("Quản lý Phụ liệu")) {
            setRefreshKey(prev => prev + 1);
        }

    };

    const handleSubMenuClick = (parent, subItem) => {
        setSelected([parent, subItem]); // Lưu cả danh mục cha và danh mục con
    };
    const handleLogoClick = () => {
        setSelected(["Trang Chủ"]);
        setIsAdding(false);
        setSelectedUserId(null);
    };
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                // Gọi API đơn hôm nay
                const orderRes = await axios.get("http://localhost:8081/api/orders/count-today", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrderCount(orderRes.data);

                // Gọi API doanh thu hôm nay
                const incomeRes = await axios.get("http://localhost:8081/api/income/daily", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDailyIncome(incomeRes.data.totalIncome);

                // Format hourlyIncome về dạng array cho biểu đồ
                const hourlyData = Object.entries(incomeRes.data.hourlyIncome).map(([hour, value]) => ({
                    hour: `${hour}h`,
                    income: value,
                }));
                setHourlyIncome(hourlyData);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu dashboard:", err);
            }
        };

        fetchStats();
    }, []);
    useEffect(() => {
        const fetchMonthlyOrderCount = async () => {
            try {
                const response = await axios.get("http://localhost:8081/api/orders/count-month", {
                    headers: {
                        Authorization: `Bearer ${token}`, // nếu có token
                    },
                });
                setMonthlyOrderCount(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy số đơn hàng trong tháng:", error);
            }
        };

        fetchMonthlyOrderCount();
    }, []);

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <h2 className={styles.logoD} onClick={handleLogoClick}>
                    <FaStore style={{marginRight: "8px"}}/>
                    Coffee Shop
                </h2>
                <ul>
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            <li
                                className={selected[0] === item.name ? styles.active : ""}
                                onClick={() => handleMenuClick(item)}
                            >
                                {item.icon} {item.name}
                            </li>
                            {item.subItems && expanded === item.name && (
                                <ul className={styles.subMenu}>
                                    {item.subItems.map((subItem) => (
                                        <li
                                            key={subItem.name}
                                            className={selected[1] === subItem.name ? styles.active1 : ""}
                                            onClick={() => handleMenuClickP(item.name, subItem.name)}
                                        >
                                            {subItem.icon} {subItem.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </ul>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.headerD}>
                    <h1 className={styles.titleD}>
                        {selected[0]} {selected[1] ? `/ ${selected[1]}` : ""}
                    </h1>
                    {userName && (
                        <div className={styles.userInfoD}>
                            <span className={styles.userNameD}>Xin chào, {userName}!</span>
                            {imageUrl && (
                                // eslint-disable-next-line react/jsx-no-undef
                                <Link to="/edit-admin">
                                <img src={imageUrl} alt="User Avatar" className={styles.avatarD} />
                                </Link>
                            )}
                            <button className={styles.logoutButton} onClick={logout}>
                                <FiLogOut className={styles.logoutIcon} /> Đăng xuất
                            </button>
                        </div>
                    )}

                </header>

                <section className={styles.dashboardContent}>
                    {selected[0] ? (
                        !selected[1] ? (
                            // 👉 Khi chỉ chọn danh mục cha, hiển thị giao diện mặc định
                            <div className={styles.defaultContent}>
                                <h2 className={styles.welcomeTitle}>
                                    <span role="img" aria-label="wave">👋</span> Chào mừng đến với <strong>Coffee Shop Admin</strong>
                                </h2>
                                <p className={styles.welcomeSubtitle}>
                                    Hãy chọn một mục từ menu bên trái để bắt đầu quản lý.
                                </p>

                                {/* Quick Stats */}
                                <div className={styles.quickStats}>
                                    <div className={styles.statCard}>☕ <span>{orderCount}</span><p>Đơn hôm nay</p></div>
                                    <div className={styles.statCard}>
                                        💸 <span>{new Intl.NumberFormat('vi-VN').format(dailyIncome)} VND</span>
                                        <p>Doanh thu hôm nay</p>
                                    </div>
                                    <div className={styles.statCard}>
                                        🧾 <span>{monthlyOrderCount}</span>
                                        <p>Tổng hóa đơn tháng</p>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className={styles.chartWrapper}>
                                    <h3 className={styles.chartTitle}>📊 Doanh thu theo giờ (trong ngày)</h3>
                                    <div className={styles.areaChartBox}>
                                        <AreaChart width={1000} height={350} data={hourlyIncome}>
                                            <defs>
                                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6f4e37" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#6f4e37" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="hour" tick={{fontSize: 12, fill: '#444'}} label={{value: "Giờ", position: "insideBottomRight", offset: -5}} />
                                            <YAxis tick={{fontSize: 12, fill: '#444'}} label={{value: "Doanh thu (VNĐ)", angle: -90, position: "insideLeft", offset: 10}} />
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ccc" }}
                                                labelStyle={{ color: "#6f4e37" }}
                                                formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="income"
                                                stroke="#6f4e37"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorIncome)"
                                            />
                                        </AreaChart>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className={styles.quickActions}>
                                    <button onClick={() => setSelected(["Quản Lý Sản Phẩm", "Chỉnh Sửa Sản Phẩm"])}>📦 Quản lý sản phẩm</button>
                                    <button onClick={() => setSelected(["Quản Lý Nhân Viên", "Tạo và quản lý nhân viên"])}>👨‍💼 Nhân viên</button>
                                    <button onClick={() => setSelected(["Quản Lý Hóa Đơn", "Xem Hóa Đơn"])}>🧾 Hóa đơn</button>
                                </div>

                                {/* DateTime & Tips */}
                                <div className={styles.sideWidgets}>
                                    <div className={styles.datetimeBox}>
                                        📅 Hôm nay: <strong>{date}</strong><br/>
                                        ⏰ Giờ hiện tại: <strong>{time}</strong>
                                    </div>
                                    <div className={styles.tipsBox}>
                                        <h4>🧠 Mẹo hôm nay:</h4>
                                        <p>Kiểm tra tồn kho sản phẩm trước giờ cao điểm để đảm bảo phục vụ tốt hơn!</p>
                                    </div>
                                </div>
                            </div>
                        ) : selected[0] === "Quản Lý Nhân Viên" && selected[1] === "Tạo và quản lý nhân viên" ? (
                            isAdding ? (
                                <AddEmployeeForm onCancel={() => setIsAdding(false)} />
                            ) : (
                                !selectedUserId && (
                                    <UserList
                                        key={refreshKey}
                                        onAdd={() => setIsAdding(true)}
                                        onEdit={(id) => setSelectedUserId(id)}
                                    />
                                )
                            )
                        ) : selected[0] === "Quản Lý Danh Mục" && selected[1] === "Quản lý nhóm món" ? (
                            isAdding ? (
                                <CategoryForm onCancel1={() => setIsAdding(false)} />
                            ) : (
                                <CategoryManagement key={refreshKey} onAdd1={() => setIsAdding(true)} />
                            )
                        ) : selected[0] === "Quản Lý Sản Phẩm" && selected[1] === "Chỉnh Sửa Sản Phẩm" ? (
                            <ProductList key={productKey} />
                        ): selected[0] === "Quản lý Phụ liệu" && selected[1] === "Chỉnh Sửa phụ liệu" ? (
                            <ToppingList key={refreshKey} />
                        ): selected[0]?.startsWith("Quản Lý Nguyên Liệu") && selected[1] === "Chỉnh Sửa Nguyên Liệu" ? (
                                <IngredientList key={refreshKey} />
                            ) : selected[0] === "Quản Lý Công Thức Món" && selected[1] === "Thiết Lập Thành Phần" ? (
                            <ProductIngredientList key={refreshKey} />
                        ): selected[0] === "Thiết Lập Cho Phụ Liệu" && selected[1] === "Cấu Hình Phụ Liệu" ? (
                            <ToppingIngredientList key={refreshKey} />
                        ) : selected[0] === "Quản Lý Bàn" && selected[1] === "Chỉnh Sửa Bàn" ? (
                            <TableManager key={refreshKey} />
                        ): selected[0] === "Quản Lý Khuyến Mãi" && selected[1] === "Chỉnh Sửa Khuyến Mãi" ? (
                            <DiscountList key={refreshKey} />
                        )  : selected[0] === "Quản lý phản hồi" && selected[1] === "Xem phản hồi" ? (
                            <FeedbackList key={refreshKey} />
                        ): selected[0] === "Quản Lý Hóa Đơn" && selected[1] === "Xem Hóa Đơn" ? (
                            <InvoiceTable key={refreshKey} />
                        )  : selected[0] === "Thống Kê" && selected[1] === "Tính Thu Nhập" ? (
                            <IncomeManager key={refreshKey} />
                        )

                                :(
                            <div></div>
                        )
                    ) : null}

                    {/* Render UpdateUser chỉ khi có selectedUserId và đảm bảo không render trùng lặp */}
                    {selectedUserId && !isAdding && <UpdateUser userId={selectedUserId} onCancel={handleCancel}/>}
                </section>


            </main>
            {showIngredientWarning && (
                <div className={styles.modalOverlayh}>
                    <div className={styles.modalContenth}>
                        <h3>⚠️ Cảnh báo nguyên liệu gần hết!</h3>
                        <ul>
                            {lowIngredients.map((item) => (
                                <li key={item.id}>
                                    {item.name} còn {item.quantityInStock} {item.unit}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowIngredientWarning(false)}>Đã hiểu</button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Dashboard;


