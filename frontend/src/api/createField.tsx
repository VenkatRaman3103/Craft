import { backendUrl } from "@/config";
import axios from "axios";

// create a new feild
export const createField = async (field, parent_id, itemType, templateId) => {
    console.log("createField:", field, parent_id, itemType, templateId);

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

    const endpoint = fieldEndpoints[field.type];
    if (!endpoint) {
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    let fieldData = field;
    if (
        field.type === "multi_select_field" ||
        field.type === "single_select_field"
    ) {
        fieldData = {
            name: field.name,
            label: field.label,
            options: field.options,
            selectedOptions: field.selectedOptions,
            field: field,
        };
    }

    response = await axios.post(`${backendUrl}${endpoint}`, fieldData);
    const field_id = response.data[0].field_id;

    const joinTableConfig = {
        collection: {
            endpoint: `/collection/${parent_id}/collection_items`,
            idField: "collection_id",
        },
        page: {
            endpoint: `/page/${parent_id}/page_items`,
            idField: "page_id",
        },
        block: {
            endpoint: `/block/${parent_id}/block_items`,
            idField: "block_id",
        },
        normal: {
            endpoint: `/normal/${parent_id}/block_items`,
            idField: "block_id",
        },
        array: {
            endpoint: `/array/${parent_id}/block_items`,
            idField: "parent_block_id",
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
    if (itemType == "array") {
        await axios.post(`${backendUrl}${config.endpoint}`, {
            [config.idField]: parent_id,
            reference_id: field_id,
            type: field.type,
            parent_template_id: templateId,
        });
    } else if (itemType == "normal") {
        await axios.post(`${backendUrl}${config.endpoint}`, {
            [config.idField]: parent_id,
            reference_id: field_id,
            type: field.type,
        });
    } else if (itemType == "page") {
        await axios.post(`${backendUrl}${config.endpoint}`, {
            reference_id: field_id,
            type: field.type,
        });
    }

    console.log(field_id, `Field created and linked to ${itemType}`);
    return response?.data;
};
