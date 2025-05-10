import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Thay bằng URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm token vào header của mọi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
