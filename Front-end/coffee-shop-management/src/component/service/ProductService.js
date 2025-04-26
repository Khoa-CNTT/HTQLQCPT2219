// src/service/ProductService.js
import axios from 'axios';

const API_URL = "http://localhost:8081/api/product"; // URL cho các API Product

// API để lấy sản phẩm theo mã danh mục
export const getProductsByCategory = async (categoryCode) => {
    try {
        const response = await axios.get(`${API_URL}/category/${categoryCode}`);
        return response.data.content; // Trả về danh sách sản phẩm từ response
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
};
// Lấy tất cả các danh mục
export const getAllProduct = async (page, size) => {
    try {
        const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
        console.log(response.data); // Kiểm tra dữ liệu trả về
        return response.data; // Trả về cả dữ liệu sản phẩm và các thông tin phân trang (nếu có)
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
export const fetchProducts = async (page = 0, size = 50) => {
    try {
        const response = await fetch(`http://localhost:8081/api/product?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error("Lỗi khi gọi API");
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi trong service fetchProducts:", error);
        throw error; // throw lại để xử lý ở component nếu cần
    }
};
// Hàm tìm kiếm sản phẩm
export const searchProducts = async (searchTerm, page = 0, size = 9) => {
    try {
        const response = await axios.get("http://localhost:8081/api/product/search", {
            params: {
                searchTerm: searchTerm,
                page: page,
                size: size,
            },
        });
        return response.data; // Trả về dữ liệu JSON từ backend
    } catch (error) {
        console.error("Error fetching search results:", error);
        return null;
    }
};
export const searchProductsByCategory = async (keyword, category, page, size) => {
    const response = await fetch(
        `http://localhost:8080/api/product/searchCategory?keyword=${keyword}&category=${category}&page=${page}&size=${size}`
    );
    if (!response.ok) throw new Error("Failed to fetch products by category");
    return await response.json();
};

