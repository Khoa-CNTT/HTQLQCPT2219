// toppingService.js
import axios from "axios";
const API_URL = "http://localhost:8081/api/topping";

export const getAllToppings = async () => {
    try {
        const response = await axios.get(API_URL);
        // console.log("Full Response:", response); // Kiểm tra toàn bộ phản hồi
        console.log("Data:", response.data); // Kiểm tra phần dữ liệu
        return response.data; // Trả về danh sách topping
    } catch (error) {
        console.error("Error fetching toppings:", error);
        return [];
    }
};
