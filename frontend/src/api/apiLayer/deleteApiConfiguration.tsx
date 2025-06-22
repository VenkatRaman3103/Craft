import { backendUrl } from "@/config";
import axios from "axios";

export const deleteApiConfiguration = async (id: string) => {
    const response = await axios.delete(`${backendUrl}/api-config/${id}`);
    console.log(response);
    return response.data;
};
