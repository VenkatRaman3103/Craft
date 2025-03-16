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
export const createField = async (field, parent_id, itemType) => {
    console.log(field, "itemType");

    let response;
    const fieldEndpoints = {
        multi_select_field: "/fields/mutli_select", // Note: there's a typo in 'mutli_select'
        single_select_field: "/fields/single_select",
        text_field: "/fields/text",
        number_field: "/fields/number",
        email_field: "/fields/email",
        date_field: "/fields/date",
        color_picker_field: "/fields/color_picker",
        textarea_field: "/fields/textarea_field",
        json_field: "/fields/json_field",
        url_field: "/fields/url_field",
    };

    // Create the field based on its type
    const endpoint = fieldEndpoints[field.type];
    if (!endpoint) {
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    // Prepare the field data based on field type
    let fieldData = field;
    if (
        field.type === "multi_select_field" ||
        field.type === "single_select_field"
    ) {
        fieldData = {
            name: field.name,
            label: field.label,
            options: field.options,
            is_selected: field.selectedOptions,
        };
    }

    // Create the field
    response = await axios.post(`${backendUrl}${endpoint}`, fieldData);
    const field_id = response.data[0].field_id;

    // Determine which join table to update based on itemType
    const joinTableConfig = {
        collection: {
            endpoint: `/collection/${parent_id}/collection_items`,
            idField: "collection_id",
        },
        page: {
            endpoint: `/page/${parent_id}/page_items`,
            idField: "page_id",
        },
        // page: {
        //     endpoint: `/page/${parent_id}/page_items`,
        //     idField: "page_id",
        // },
        // collection: {
        //     endpoint: `/collection/${parent_id}/collection_items`,
        //     idField: "collection_id",
        // },
    };

    const config = joinTableConfig[itemType];

    console.log(config, "config");

    if (!config) {
        throw new Error(`Unsupported item type: ${itemType}`);
    }

    // Update the join table (page_items or collection_items)
    await axios.post(`${backendUrl}${config.endpoint}`, {
        [config.idField]: parent_id,
        reference_id: field_id,
        type: field.type,
    });

    console.log(field_id, `Field created and linked to ${itemType}`);
    return response?.data;
};
