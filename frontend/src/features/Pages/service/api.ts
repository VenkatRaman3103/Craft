import { backendUrl } from "@/config";
import { NewElementType } from "@/type/NewElementType";
import axios from "axios";
import { NewPageType } from "../types/PagesType";

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

export async function createNewPage({
    name,
    slug,
    description,
    element_id,
}: NewPageType) {
    try {
        const response = await axios.post(
            `${backendUrl}/pages/${element_id}/element`,
            {
                name,
                slug,
                description,
            },
        );

        return response.data;
    } catch (error) {
        const errorMessage = {
            origin: "createNewPage",
            error: error,
        };

        return errorMessage;
    }
}
