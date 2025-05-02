import { backendUrl } from "@/config";
import axios from "axios";

export const getReferenceBlock = async (block_id) => {
    const referenceBlock = await axios.get(
        `${backendUrl}/reference/${block_id}`,
    );
    return referenceBlock.data;
};

export const getBlockItems = async (block_id) => {
    const response = await axios.get(
        `${backendUrl}/reference/items/${block_id}`,
    );
    return response.data;
};

export const saveBlock = async ({ pagesList, reference_type, block_id }) => {
    await axios.patch(`${backendUrl}/reference/${block_id}/reference_type`, {
        reference_type,
    });
    await axios.post(`${backendUrl}/reference/items/${block_id}`, {
        pagesList,
    });
};
