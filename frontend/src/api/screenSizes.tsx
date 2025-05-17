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
