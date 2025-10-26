import { backendUrl } from "@/config";
import { NewCollectionType } from "@/type/NewCollection";
import axios from "axios";

export async function createNewCollectionUnderGroups({
    referenceId: group_id,
    name,
    description,
    slug,
}: NewCollectionType) {
    try {
        const response = await axios.post(
            `${backendUrl}/collections/${group_id}/groups`,
            {
                name,
                description,
                slug,
            },
        );

        console.log("new collection created under group", response.data);
    } catch (error) {
        const errorMessage = {
            origin: "createNewCollectionUnderGroups",
            error: error,
        };

        return errorMessage;
    }

    return {};
}

// get collection with all children
export async function getCollection(collection_id: string | undefined) {
    try {
        const response = await axios.get(
            `${backendUrl}/collections/${collection_id}`,
        );

        return response.data[0];
    } catch (error) {
        const errorMessage = {
            origin: "getCollection",
            error: error,
        };

        return errorMessage;
    }
}
