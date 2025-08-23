import { backendUrl } from "@/config";
import axios from "axios";

type props = string | undefined;

export const getCollections = async (collection_slug: props) => {
    try {
        const collectios = await axios.get(
            `${backendUrl}/collections/${collection_slug}`,
        );

        return collectios.data;
    } catch (error) {
        const erroMessage = {
            message: "error in fetching the root collections",
            error: error,
        };
        console.warn(erroMessage);
    }
};
