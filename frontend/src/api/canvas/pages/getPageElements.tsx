import { backendUrl } from "@/config";
import axios from "axios";

export const getPageElements = async (page_id: string | undefined) => {
    if (page_id) {
        const response = await axios.get(
            `${backendUrl}/canvas/pages/elements/${page_id}`,
        );

        return response.data;
    }
};
