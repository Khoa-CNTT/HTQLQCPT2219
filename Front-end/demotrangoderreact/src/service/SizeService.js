import axios from "axios";

const BASE_URL = "http://localhost:8081/api/sizes";

export const getAllSizes = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching sizes:", error);
        throw error;
    }
};
