import { backendUrl } from "@/config";
import axios from "axios";

export async function getPagesByElementId(elementId: string | null) {
    try {
        const response = await axios.get(
            `${backendUrl}/pages/${elementId}/element`,
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getPagesByElementId",
            error: error,
        };

        return errorMessage;
    }
}
