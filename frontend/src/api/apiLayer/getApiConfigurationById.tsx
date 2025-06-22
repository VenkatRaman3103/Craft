import { backendUrl } from "@/config";
import axios from "axios";

export const getApiConfigurationById = async (id: string) => {
    const response = await axios.get(`${backendUrl}/api-config/${id}`);
    return response.data;
};
