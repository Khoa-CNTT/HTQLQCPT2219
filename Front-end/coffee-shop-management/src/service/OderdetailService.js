import axios from 'axios';
import data from "bootstrap/js/src/dom/data";

const API_URL = "http://localhost:8081/api/oder-details";
// Hàm để gọi API lấy tất cả order details
export const getAllOderDetails = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get((API_URL), {
            headers: {
                Authorization: `Bearer ${token}`, // Đính kèm token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error; // Nếu có lỗi, ném lỗi để component có thể xử lý
    }
};
