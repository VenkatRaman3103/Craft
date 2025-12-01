import { backendUrl } from "@/config";
import axios from "axios";

export const createTextField = async (section_id, field) => {
    try {
        const response = await axios.post(
            `${backendUrl}/text-field/${section_id}`,
            field,
        );

        return response.data;
    } catch (error) {
        return {
            origin: "createTextField",
            error,
        };
    }
};
