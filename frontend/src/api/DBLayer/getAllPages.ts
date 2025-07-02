import { backendUrl } from "@/config";
import axios from "axios";

export const getAllPages = async () => {
    const response = await axios.get(`${backendUrl}/pages`);
    console.log(response);
    return response.data;
};
