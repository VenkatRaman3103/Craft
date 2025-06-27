import { backendUrl } from "@/config";
import axios from "axios";

export const getAllCollections = async () => {
    const response = await axios.get(`${backendUrl}/collections`);
    console.log(response);
    return response.data;
};
