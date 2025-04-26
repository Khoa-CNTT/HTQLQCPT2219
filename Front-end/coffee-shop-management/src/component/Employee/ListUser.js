import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {deleteUser, getUsers, searchUsers} from "../../service/UserService";
import styles from "../../Css/UserList.module.css";
import styles1 from "../../Css/UpdateUser.module.css";
import {FaEdit, FaEye, FaSearch, FaTrash} from "react-icons/fa";
import { getUserById, updateUser } from '../../service/UserService';
import {useNavigate, useParams} from "react-router-dom";
import Modal from "react-modal";
import {toast} from "react-toastify";

Modal.setAppElement("#root"); // ✅ Đúng


const UserList = ({ onAdd ,onEdit}) => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userName, setUserName] = useState(""); // State cho tên đăng nhập
    const [fullName, setFullName] = useState(""); // State cho họ và tên
    const [numberPhone, setNumberPhone] = useState(""); // State cho số điện thoại
    const [selectedUser, setSelectedUser] = useState(null); // State lưu thông tin người dùng chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // State kiểm tra modal
    const size = 10;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const { userId } = useParams();// Lấy userId từ params trong React Router
    const navigate = useNavigate(); // Hook điều hướng mới của React Router v6
    // State modal xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Đây là phần truyền lại hàm chỉnh sửa khi click vào icon
    const handleEditClick = (userId) => {
        console.log('Clicked edit for user ID:', userId); // Kiểm tra giá trị userId
        onEdit(userId); // Gọi hàm onEdit từ props khi nhấn chỉnh sửa
    };
// Mở modal xác nhận xóa
    const confirmDelete = (user) => {
        console.log("Đã click vào xóa:", user); // Kiểm tra có vào hàm không
        setUserToDelete(user);
        setShowDeleteModal(true);
        console.log("showDeleteModal:", showDeleteModal); // Kiểm tra state trước khi render
    };


    // Đóng modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };
    // Xóa người dùng
    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.userId);
            toast.success("Xóa người dùng thành công!");
            setShowDeleteModal(false); // Đóng modal sau khi xóa
            fetchUsers(page); // Tải lại danh sách người dùng
        } catch (error) {
            toast.error("Lỗi khi xóa người dùng");
        }
    };

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const fetchedUser = await getUserById(userId); // Lấy thông tin người dùng từ API
    //             setUser(fetchedUser);
    //             setFormData(fetchedUser); // Cập nhật dữ liệu vào form
    //             setModalIsOpen(true); // Mở modal
    //         } catch (error) {
    //             console.error("Error fetching user:", error);
    //         }
    //     };
    //
    //     if (userId) fetchUser(); // Gọi API nếu userId có giá trị
    // }, [userId]);
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };
    //
    // const handleSave = async () => {
    //     try {
    //         await updateUser(user.id, formData); // Cập nhật thông tin người dùng qua API
    //         setModalIsOpen(false);
    //         // Có thể làm mới danh sách người dùng hoặc thông báo thành công
    //     } catch (error) {
    //         console.error("Error updating user:", error);
    //     }
    // };
    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    // Mở modal và set thông tin người dùng
    const handleOpenModal = (user) => {
        setSelectedUser(user);  // Set thông tin người dùng cần xem chi tiết
        setIsModalOpen(true);    // Mở modal
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);  // Đóng modal
    };
    const fetchUsers = async (page) => {
        try {
            // Gọi API tìm kiếm người dùng với các tham số tìm kiếm
            const data = await searchUsers(userName, fullName, numberPhone, localStorage.getItem('token'), page, size);
            setUsers(data.content); // Cập nhật danh sách người dùng
            setTotalPages(data.totalPages); // Cập nhật tổng số trang
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };
    // // Xử lý thay đổi giá trị input
    const handleSearch = () => {
        setPage(0); // Reset về trang đầu khi tìm kiếm
        fetchUsers(0); // Gọi lại API khi thực hiện tìm kiếm
    };


    const handlePrevious = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };
    // const handleOpenEditModal = (user) => {
    //     console.log("User data before editing:", user);
    //     setUser(user);
    //     setFormData(user); // Kiểm tra dữ liệu có đúng không
    //     setModalIsOpen(true);
    // };
    // const genderValue = formData.gender ? 'male' : 'female';


    return (

        <div className={styles.containerU}>
            <h2 className={styles.titleU}>Danh sách người dùng</h2>

            {/* Chức năng tìm kiếm */}
            {/* Chức năng tìm kiếm */}
            <div className={styles.searchWrapperu}>
                <div className={styles.searchContainerU}>
                    <div className={styles.searchInputWrapperu}>
                        <input
                            type="text"
                            id="username"
                            placeholder="Tìm kiếm tên đăng nhập..."
                            className={styles.searchInputu}
                            value={userName} // Liên kết với state
                            onChange={(e) => setUserName(e.target.value)} // Cập nhật giá trị khi thay đổi
                        />
                    </div>
                    <div className={styles.searchInputWrapperu}>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Tìm kiếm họ và tên..."
                            className={styles.searchInputu}
                            value={fullName} // Liên kết với state
                            onChange={(e) => setFullName(e.target.value)} // Cập nhật giá trị khi thay đổi
                        />
                    </div>
                    <div className={styles.searchInputWrapperu}>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Tìm kiếm số điện thoại..."
                            className={styles.searchInputu}
                            value={numberPhone} // Liên kết với state
                            onChange={(e) => setNumberPhone(e.target.value)} // Cập nhật giá trị khi thay đổi
                        />
                    </div>
                    <button  onClick={handleSearch} className={styles.searchButtonu}>
                        <FaSearch className={styles.searchIconu}/> Tìm kiếm
                    </button>
                </div>
            </div>
            {/* Nút Thêm nhân viên nằm dưới khối tìm kiếm */}
            <div className={styles.addButtonWrapperu} onClick={onAdd}>
                <button className={styles.addButtonu}>+ Thêm nhân viên</button>
            </div>

            {/* Bảng danh sách */}
            <div className={styles.tableWrapperu}>
                <table className={styles.tableu}>
                    <thead>
                    <tr>
                        <th className={styles.sttColumn}>STT</th>
                        <th className={styles.usernameColumn}>Tên đăng nhập</th>
                        <th className={styles.fullNameColumn}>Họ và tên</th>
                        <th className={styles.addressColumn}>Địa chỉ</th>
                        <th className={styles.phoneColumn}>Số điện thoại</th>
                        <th className={styles.genderColumn}>Giới tính</th>
                        <th className={styles.birthdayColumn}>Ngày sinh</th>
                        <th className={styles.roleColumn}>Vai trò</th>
                        <th className={styles.actionColumn}>Tác vụ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users
                        .map((user, index) => (
                            <tr key={user.userId}>
                                <td className={styles.sttColumn}>{index + 1 + page * 10}</td>
                                <td className={styles.usernameColumn}>{user.username}</td>
                                <td className={styles.fullNameColumn}>{user.fullName}</td>
                                <td className={styles.addressColumn}>{user.address}</td>
                                <td className={styles.phoneColumn}>{user.numberphone}</td>
                                <td className={styles.genderColumn}>{user.gender ? "Nam" : "Nữ"}</td>
                                <td className={styles.birthdayColumn}>
                                    {new Date(user.birthday).toLocaleDateString()}
                                </td>
                                <td className={styles.roleColumn}>
                                    {user.role.roleName === "ROLE_USER" ? "Nhân viên" : "Quản lý"}
                                </td>
                                <td className={styles.actionColumn}>
                                    <FaEye
                                        className={styles.iconu}
                                        title="Xem chi tiết"
                                        onClick={() => handleOpenModal(user)} // Mở modal khi nhấn vào nút Xem chi tiết
                                    />
                                    <FaEdit
                                        className={styles.iconu}
                                        title="Chỉnh sửa"
                                        onClick={() => handleEditClick(user.userId)} // Gọi hàm khi nhấn nút
                                    />

                                    <FaTrash
                                        className={styles.iconu}
                                        title="Xóa"
                                        onClick={() => confirmDelete(user)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal */}


            {showDeleteModal && userToDelete && (
                <div className={styles.modalc}>
                    <div className={styles.modalContentc}>
            <span className={styles.closeIconc} onClick={handleCloseDeleteModal}>
                ✖
            </span>
                        <h3>⚠️ Bạn có chắc muốn xóa người dùng có tên là: <b>{userToDelete?.fullName}</b>?</h3>
                        <button onClick={handleDelete} className={styles.deleteBtnc}>🗑 Xóa</button>
                        {/*<button onClick={handleCloseDeleteModal} className={styles.cancelBtnc}>❌ Hủy</button>*/}
                    </div>
                </div>
            )}



            {/* Modal hiển thị chi tiết */}
            {isModalOpen && selectedUser && (
                <div className={styles.modalu}>
                    <div className={styles.modalContentu}>
                        <span className={styles.closeu} onClick={handleCloseModal}>×</span>
                        <h3>Chi tiết người dùng</h3>
                        {/* Thêm ảnh dưới tiêu đề */}
                        {selectedUser.imgUrl && (
                            <img src={selectedUser.imgUrl} alt="Avatar" className={styles.userImageu} />
                        )}
                        <div className={styles.modalDetailsu}>
                            <p><strong>Tên đăng nhập:</strong> {selectedUser.username}</p>
                            <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
                            <p><strong>Địa chỉ:</strong> {selectedUser.address}</p>
                            <p><strong>Email</strong> {selectedUser.email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedUser.numberphone}</p>
                            <p><strong>Giới tính:</strong> {selectedUser.gender ? "Nam" : "Nữ"}</p>
                            <p><strong>Ngày sinh:</strong> {new Date(selectedUser.birthday).toLocaleDateString()}</p>
                            <p><strong>Vai trò:</strong> {selectedUser.role.roleName === "ROLE_USER" ? "Nhân viên" : "Quản lý"}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Phân trang */}
            <div className={styles.paginationu}>
                <button onClick={handlePrevious} disabled={page === 0} className={styles.pageButtonu}>
                    Trước
                </button>
                <span className={styles.pageInfou}>Trang {page + 1} / {totalPages}</span>
                <button onClick={handleNext} disabled={page >= totalPages - 1} className={styles.pageButtonu}>
                    Sau
                </button>
            </div>

        </div>
    );
};

export default UserList;
