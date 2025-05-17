import { backendUrl } from "@/config";
import axios from "axios";

export const getScreenSizes = async () => {
    try {
        const response = await axios.get(`${backendUrl}/canvas/screen-size`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const createNewScreen = async (payload) => {
    await axios.post(`${backendUrl}/canvas/screen-size`, payload);
};

export const deleteScreenSize = async (id) => {
    await axios.delete(`${backendUrl}/canvas/screen-size/${id}`);
};

export const updateScreenSize = async (id, updates) => {
    await axios.patch(`${backendUrl}/canvas/screen-size/${id}`, updates);
};
