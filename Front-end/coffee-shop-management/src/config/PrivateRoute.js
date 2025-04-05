import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedRole = JSON.parse(localStorage.getItem('roles')); // Lấy role từ localStorage
        setRole(storedRole);  // Cập nhật state role
        setLoading(false); // Đánh dấu quá trình tải đã hoàn thành
    }, []);

    if (!token) {
        // Nếu không có token, chuyển hướng đến trang đăng nhập
        return <Navigate to="/dangnhap" replace />;
    }

    if (loading) {
        // Hiển thị trạng thái chờ trong khi dữ liệu role đang được tải
        return <div>Loading...</div>;
    }

    if (!role) {
        // Nếu không có role trong localStorage, chuyển hướng đến trang Unauthorized
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredRole && role.roleName !== requiredRole) {
        // Nếu role không phù hợp với requiredRole, chuyển hướng đến trang Unauthorized
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu vai trò hợp lệ, hiển thị nội dung con
    return children;
};

export default PrivateRoute;
