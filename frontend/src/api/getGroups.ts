import { backendUrl } from "@/config";
import axios from "axios";

export const getGroups = async () => {
    try {
        const response = await axios.get(`${backendUrl}/groups/all`);
        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getGroups",
            error: error,
        };

        return errorMessage;
    }
};
