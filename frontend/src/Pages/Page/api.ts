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

    // Create the block
    const blocksResponse = await axios.post(
        `${backendUrl}/block/reference/${page_id}`,
        blockData,
    );

    // Associate the block with the page
    await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
        page_id,
        reference_id: blocksResponse.data.block_id,
        type: "block",
    });

    return blocksResponse.data;
};

// create a new feild
export const createField = async (field, page_id) => {
    let response;

    if (field.type === "multi_select_field") {
        response = await axios.post(`${backendUrl}/fields/mutli_select`, {
            name: field.name,
            label: field.label,
            options: field.options,
            is_selected: field.selectedOptions,
        });

        await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
            page_id,
            reference_id: response.data[0].field_id,
            type: "multi_select_field",
        });
    } else if (field.type === "single_select_field") {
        response = await axios.post(`${backendUrl}/fields/single_select`, {
            name: field.name,
            label: field.label,
            options: field.options,
            is_selected: field.selectedOptions,
        });

        await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
            page_id,
            reference_id: response.data[0].field_id,
            type: "single_select_field",
        });
    } else if (field.type === "text_field") {
        response = await axios.post(`${backendUrl}/fields/text`, field);

        await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
            page_id,
            reference_id: response.data[0].field_id,
            type: "text_field",
        });
    } else if (field.type === "number_field") {
        response = await axios.post(`${backendUrl}/fields/number`, field);

        await axios.post(`${backendUrl}/page/${page_id}/page_items`, {
            page_id,
            reference_id: response.data[0].field_id,
            type: "number_field",
        });
    }

    console.log(response?.data[0].field_id, "Field create response");
    return response?.data;
};
