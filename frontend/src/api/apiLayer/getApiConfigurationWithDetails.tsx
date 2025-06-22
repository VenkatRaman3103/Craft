import { backendUrl } from "@/config";
import axios from "axios";

export const getApiConfigurationWithDetails = async (id: string) => {
    const response = await axios.get(`${backendUrl}/api-config/${id}/details`);
    return response.data;
};
