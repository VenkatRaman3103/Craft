import { backendUrl } from "@/config";
import axios from "axios";

export const deleteMediaById = async (media_id) => {
    const response = await axios.delete(`${backendUrl}/uploads/${media_id}`);
    return response.data;
};
