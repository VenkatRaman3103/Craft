import axios from "axios";
import { backendUrl } from "@/config";

// Fetch page data
export const fetchPageData = async (page_id) => {
    const response = await axios.get(`${backendUrl}/page/${page_id}`);
    return response.data;
};

// Create a new block
export const createBlock = async (page_id, blockData) => {
    if (!blockData.name) throw new Error("Block name is required");

    console.log(blockData, "blockData");

    // Create the block
    const blocksResponse = await axios.post(
        `${backendUrl}/block/reference/${page_id}`,
        blockData,
    );

    // Associate the block with the page
    await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
        page_id,
        reference_id: blocksResponse.data.block_id,
        type: blockData.blockType,
    });

    return blocksResponse.data;
};
