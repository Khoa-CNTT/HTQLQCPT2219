import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, user }) => {
    // Kiểm tra nếu người dùng chưa đăng nhập hoặc không có quyền truy cập
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />; // Chuyển hướng về trang đăng nhập
    }

    // Nếu người dùng có quyền, hiển thị nội dung
    return element;
};

export default ProtectedRoute;
