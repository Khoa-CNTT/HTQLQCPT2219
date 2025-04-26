import axios from 'axios';

const API_URL = 'http://localhost:8081/api/orders'; // Địa chỉ API backend của bạn

// Lấy danh sách OrderDetail của bàn từ backend
export const getOrderDetailsByTable = async (tableId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/table/${tableId}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Thêm token vào header Authorization
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderDetailId, status) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${orderDetailId}/status`, status, {
        headers: {
            Authorization: `Bearer ${token}`,  // Thêm token vào header Authorization
        }
    });
    return response.data;
};