import { backendUrl } from "@/config";
import axios from "axios";

export const getRootCollections = async () => {
    try {
        const rootCollectios = await axios.get(
            `${backendUrl}/collections/root`,
        );

        return rootCollectios.data;
    } catch (error) {
        const erroMessage = {
            message: "error in fetching the root collections",
            error: error,
        };
        console.warn(erroMessage);
    }
};
