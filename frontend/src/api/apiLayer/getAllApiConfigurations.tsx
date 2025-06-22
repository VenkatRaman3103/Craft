import { backendUrl } from "@/config";
import axios from "axios";

export const getAllApiConfigurations = async () => {
    try {
        console.log("Requesting:", `${backendUrl}/api-config`);
        const response = await axios.get(`${backendUrl}/api-config`);
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        console.error("Error details:", error.response?.data);
        console.error("Status:", error.response?.status);
        throw error;
    }
};
