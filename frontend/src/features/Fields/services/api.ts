import { backendUrl } from "@/config";
import axios from "axios";

export const createTextField = async (sections_id) => {
    try {
        const response = await axios.get(
            `${backendUrl}/text-field/${section_id}`,
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPagesByElementId",
            error: error,
        };

        return errorMessage;
    }
};
