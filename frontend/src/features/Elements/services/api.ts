import { backendUrl } from "@/config";
import axios from "axios";

export async function getElementsByCollectionId(
    collection_id: string | null | undefined,
) {
    try {
        const response = await axios.get(
            `${backendUrl}/elements/${collection_id}/collections`,
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "getElementsByCollectionId",
            error: error,
        };

        console.log(errorMessage);
        return errorMessage;
    }
}
