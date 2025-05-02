import { backendUrl } from "@/config";
import axios from "axios";

export const getApiBlock = async (blockId) => {
    try {
        const response = await fetch(`${backendUrl}/api/${blockId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch API block data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching API block:", error);
        throw error;
    }
};

export const saveBlock = async (payload) => {
    try {
        const { block_id, url, response } = payload;

        const urlUpdateResponse = await axios.patch(
            `${backendUrl}/api/${block_id}/url`,
            { url },
        );

        const responseUpdateResponse = await axios.patch(
            `${backendUrl}/api/${block_id}/response`,
            { response },
        );

        return urlUpdateResponse.data;
    } catch (error) {
        console.error("Error saving API block:", error);
        throw error;
    }
};
