import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        fullName: '',
        email: '',
        selectedRole: '', // Sử dụng roleId thay vì roleName
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/roles')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => console.error('Error fetching roles:', error));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleChange = (e) => {
        setFormData({
            ...formData,
            selectedRole: e.target.value, // Gửi roleId thay vì roleName
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/saveUser', {
            userName: formData.userName,
            password: formData.password,
            fullName: formData.fullName,
            email: formData.email,
            roleId: formData.selectedRole,  // Sửa tên field thành roleId
        })
            .then(response => {
                console.log('Đăng ký thành công:', response.data);
            })
            .catch(error => {
                console.error('Lỗi đăng ký:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>UserName:</label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Role:</label>
                <select
                    name="selectedRole"
                    value={formData.selectedRole}
                    onChange={handleRoleChange}>
                    <option value="">Select a role</option>
                    {roles.map(role => (
                        <option key={role.roleId} value={role.roleId}> {/* Gửi roleId thay vì roleName */}
                            {role.roleName}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
