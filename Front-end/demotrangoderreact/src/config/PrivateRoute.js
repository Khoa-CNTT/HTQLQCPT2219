import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRoles }) => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedRole = JSON.parse(localStorage.getItem('roles')); // Ví dụ: { roleName: "ROLE_USER" }
        setRole(storedRole);
        setLoading(false);
    }, []);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!role) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (
        requiredRoles &&
        Array.isArray(requiredRoles) &&
        !requiredRoles.includes(role.roleName)
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;
