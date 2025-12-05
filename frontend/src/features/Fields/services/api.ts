import { backendUrl } from "@/config";
import axios from "axios";

export const createTextField = async (section_id: string, field: { name: string; value: string }) => {
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

export const updateTextField = async (field_id: string, field: { name: string; value: string }) => {
    try {
        const response = await axios.patch(
            `${backendUrl}/text-field/${field_id}`,
            field,
        );

        return response.data;
    } catch (error) {
        return {
            origin: "updateTextField",
            error,
        };
    }
};
