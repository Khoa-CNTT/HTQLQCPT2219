// src/service/CategoryService.js
import axios from 'axios';

const API_URL = "http://localhost:8081/api/category"; // Đảm bảo đúng URL của API backend

// Lấy tất cả các danh mục
export const getAllCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data.content; // Lấy danh sách categories từ response
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
// Hàm gọi API POST để thêm một Category
export const addCategory = async (categoryData) => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token'); // Hoặc lấy từ sessionStorage nếu bạn lưu ở đó

        // Cấu hình header với token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Đảm bảo Content-Type là application/json
            },
        };

        // Gửi yêu cầu POST với token trong header
        const response = await axios.post(API_URL, categoryData, config);
        return response.data; // Trả về dữ liệu category vừa được thêm
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi API
    }
};
