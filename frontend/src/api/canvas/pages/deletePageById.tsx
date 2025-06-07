import { backendUrl } from "@/config";
import axios from "axios";

export const deletePageById = async (id: string) => {
    const response = await axios.delete(`${backendUrl}/canvas/pages/${id}`);
    return response;
};
