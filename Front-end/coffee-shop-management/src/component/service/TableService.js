// src/services/tableService.js
import axios from 'axios';

const API_URL = "http://localhost:8081/api/table";

export const getAllTables = async (page = 0, size = 50) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Đính kèm token trong header
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching tables:", error);
        throw error;
    }
};
export const getTableById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching table by ID:", error);
        throw error;
    }
};

