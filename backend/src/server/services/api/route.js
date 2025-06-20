import express from "express";
import { getPageDatById } from "../../pages/read.js";
import { getBlockWithNestedContent } from "../../blocks/read.js";
import { getArrayTemplates } from "../../blocks/arrayBlocks/read.js";
import { getTableData } from "../../blocks/tableBlocks/read.js";
import { getApiBlockData } from "../../blocks/apiBlocks/route.js";
import { getReferenceBlockData } from "../../blocks/referenceBlocks/read.js";
export const apiService = express.Router();

async function formatData(block) {
    if (!block) return null;
    const blockName = block.name;
    const blockType =
        block.block_type === "normal" ? "normal_block" : "array_block";
    const blockData = {
        description: block.description,
        created_at: block.createdAt,
        edited_at: block.editedAt,
        block_type: blockType,
    };

    if (block.block_items?.length > 0) {
        const fieldNameCounts = {};

        for (const item of block.block_items) {
            if (item.item_type === "normal") {
                const nestedBlockData = await formatData(item.normal);
                if (nestedBlockData) {
                    const nestedBlockName = Object.keys(nestedBlockData)[0];
                    blockData[nestedBlockName] =
                        nestedBlockData[nestedBlockName];
                }
            } else if (item.item_type === "array") {
                const templatesData = [];
                const temp = await getArrayTemplates(item.array.block_id);
                const templateArr = [];

                temp.map((templateItem) => {
                    templateArr.push({
                        name: "template",
                        block_items: templateItem.templateItems,
                    });
                });

                for (const block of templateArr) {
                    const formattedTemplate = await formatData(block);
                    if (formattedTemplate && formattedTemplate.template) {
                        templatesData.push(formattedTemplate.template);
                    } else {
                        templatesData.push(formattedTemplate);
                    }
                }

                blockData[item.array.name] = {
                    type: "array_block",
                    items: templatesData,
                };
            } else if (item.item_type === "table") {
                const fieldName = item.table.name;
                const tableData = await getTableData(item.table.block_id);

                blockData[fieldName] = {
                    type: "table_block",
                    label: item.table.label,
                    description: item.table.description,
                    block_id: item.table.block_id,
                    name: item.table.name,
                    scope: item.table.scope,
                    block_type: item.table.block_type,
                    created_at: item.table.created_at || item.table.createdAt,
                    edited_at: item.table.edited_at || item.table.editedAt,
                    columns: tableData.columns,
                    rows: tableData.rows,
                    grid: tableData.grid,
                };
            } else if (item.item_type === "reference") {
                const fieldName = item.reference.name;
                const referenceData = await getReferenceBlockData(
                    item.reference.block_id,
                );

                blockData[fieldName] = {
                    type: "reference_block",
                    label: item.reference.label,
                    description: item.reference.description,
                    block_id: item.reference.block_id,
                    name: item.reference.name,
                    scope: item.reference.scope,
                    block_type: item.reference.block_type,
                    created_at:
                        item.reference.created_at || item.reference.createdAt,
                    edited_at:
                        item.reference.edited_at || item.reference.editedAt,
                    collectionsList: referenceData.collectionsList,
                    ...referenceData,
                };
            } else if (item.item_type === "api") {
                const fieldName = item.api.name;
                const apiData = await getApiBlockData(item.api.block_id);

                blockData[fieldName] = {
                    type: "api_block",
                    label: item.api.label,
                    description: item.api.description,
                    block_id: item.api.block_id,
                    name: item.api.name,
                    scope: item.api.scope,
                    block_type: item.api.block_type,
                    created_at: item.api.created_at || item.api.createdAt,
                    edited_at: item.api.edited_at || item.api.editedAt,
                    url: apiData.url,
                    response: apiData.response,
                    ...apiData,
                };
            } else if (item.item_type === "text_field") {
                let fieldName = item.text_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "text_field",
                    label: item.text_field.label,
                    value: item.text_field.value,
                    required: item.text_field.required,
                    scope: item.text_field.scope,
                    description: item.text_field.description,
                    created_at: item.text_field.created_at,
                    edited_at: item.text_field.edited_at,
                };
            } else if (item.item_type === "textarea_field") {
                let fieldName = item.textarea_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "textarea_field",
                    label: item.textarea_field.label,
                    value: item.textarea_field.value,
                    required: item.textarea_field.required,
                    scope: item.textarea_field.scope,
                    description: item.textarea_field.description,
                    created_at: item.textarea_field.created_at,
                    edited_at: item.textarea_field.edited_at,
                };
            } else if (item.item_type === "number_field") {
                let fieldName = item.number_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "number_field",
                    label: item.number_field.label,
                    value: item.number_field.value,
                    required: item.number_field.required,
                    scope: item.number_field.scope,
                    description: item.number_field.description,
                    created_at: item.number_field.created_at,
                    edited_at: item.number_field.edited_at,
                };
            } else if (item.item_type === "multi_select") {
                let fieldName = item.multi_select.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "multi_select",
                    label: item.multi_select.label,
                    required: item.multi_select.required,
                    scope: item.multi_select.scope,
                    description: item.multi_select.description,
                    created_at: item.multi_select.created_at,
                    edited_at: item.multi_select.edited_at,
                    options: item.multi_select.options,
                };
            } else if (item.item_type === "single_select") {
                let fieldName = item.single_select.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "single_select",
                    label: item.single_select.label,
                    required: item.single_select.required,
                    scope: item.single_select.scope,
                    description: item.single_select.description,
                    created_at: item.single_select.created_at,
                    edited_at: item.single_select.edited_at,
                    options: item.single_select.options,
                };
            } else if (item.item_type === "color_picker_field") {
                let fieldName = item.color_picker_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "color_picker_field",
                    label: item.color_picker_field.label,
                    value: item.color_picker_field.value,
                    hex: item.color_picker_field.hex,
                    rgb: item.color_picker_field.rgb,
                    rgba: item.color_picker_field.rgba,
                    hsl: item.color_picker_field.hsl,
                    hsla: item.color_picker_field.hsla,
                    required: item.color_picker_field.required,
                    scope: item.color_picker_field.scope,
                    description: item.color_picker_field.description,
                    created_at: item.color_picker_field.created_at,
                    edited_at: item.color_picker_field.edited_at,
                };
            } else if (item.item_type === "date_field") {
                let fieldName = item.date_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "date_field",
                    label: item.date_field.label,
                    value: item.date_field.value,
                    required: item.date_field.required,
                    scope: item.date_field.scope,
                    description: item.date_field.description,
                    created_at: item.date_field.created_at,
                    edited_at: item.date_field.edited_at,
                };
            } else if (item.item_type === "email_field") {
                let fieldName = item.email_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "email_field",
                    label: item.email_field.label,
                    value: item.email_field.value,
                    required: item.email_field.required,
                    scope: item.email_field.scope,
                    description: item.email_field.description,
                    created_at: item.email_field.created_at,
                    edited_at: item.email_field.edited_at,
                };
            } else if (item.item_type === "json_field") {
                let fieldName = item.json_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "json_field",
                    label: item.json_field.label,
                    value: item.json_field.value,
                    required: item.json_field.required,
                    scope: item.json_field.scope,
                    description: item.json_field.description,
                    created_at: item.json_field.created_at,
                    edited_at: item.json_field.edited_at,
                };
            } else if (item.item_type === "url_field") {
                let fieldName = item.url_field.name;

                if (fieldNameCounts[fieldName]) {
                    fieldNameCounts[fieldName]++;
                    fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
                } else {
                    fieldNameCounts[fieldName] = 1;
                }

                blockData[fieldName] = {
                    type: "url_field",
                    label: item.url_field.label,
                    value: item.url_field.value,
                    url_type: item.url_field.url_type,
                    required: item.url_field.required,
                    scope: item.url_field.scope,
                    description: item.url_field.description,
                    created_at: item.url_field.created_at,
                    edited_at: item.url_field.edited_at,
                };
            }
        }
    }
    return { [blockName]: blockData };
}

async function getPageItemsData(data) {
    const pageItems = data.page_items;
    const result = {};

    for (const item of pageItems) {
        let blockData;
        if (item.item_type === "normal") {
            if (item.normal && item.normal.block_id) {
                const temp = await getBlockWithNestedContent(
                    item.normal.block_id,
                );
                const formattedData = await formatData(temp);
                if (formattedData) {
                    const blockName = Object.keys(formattedData)[0];
                    result[blockName] = formattedData[blockName];
                }
            } else {
                console.warn("Normal item missing block_id:", item);
                continue;
            }
        } else if (item.item_type === "array") {
            if (item.array && item.array.block_id) {
                const templatesData = [];
                const temp = await getArrayTemplates(item.array.block_id);
                const templateArr = [];

                temp.map((templateItem) => {
                    templateArr.push({
                        name: "template",
                        block_items: templateItem.templateItems,
                    });
                });

                for (const block of templateArr) {
                    const formattedTemplate = await formatData(block);
                    if (formattedTemplate && formattedTemplate.template) {
                        templatesData.push(formattedTemplate.template);
                    } else {
                        templatesData.push(formattedTemplate);
                    }
                }

                result[item.array.name] = {
                    type: "array_block",
                    items: templatesData,
                };
            } else {
                console.warn("Array item missing block_id:", item);
                continue;
            }
        } else if (item.item_type === "table") {
            if (item.table && item.table.block_id) {
                const tableData = await getTableData(item.table.block_id);

                result[item.table.name] = {
                    type: "table_block",
                    label: item.table.label,
                    description: item.table.description,
                    block_id: item.table.block_id,
                    name: item.table.name,
                    scope: item.table.scope,
                    block_type: item.table.block_type,
                    created_at: item.table.created_at || item.table.createdAt,
                    edited_at: item.table.edited_at || item.table.editedAt,
                    columns: tableData.columns,
                    rows: tableData.rows,
                    grid: tableData.grid,
                };
            } else {
                console.warn("Table item missing block_id:", item);
                continue;
            }
        } else if (item.item_type === "reference") {
            if (item.reference && item.reference.block_id) {
                const referenceData = await getReferenceBlockData(
                    item.reference.block_id,
                );

                result[item.reference.name] = {
                    type: "reference_block",
                    label: item.reference.label,
                    description: item.reference.description,
                    block_id: item.reference.block_id,
                    name: item.reference.name,
                    scope: item.reference.scope,
                    block_type: item.reference.block_type,
                    created_at:
                        item.reference.created_at || item.reference.createdAt,
                    edited_at:
                        item.reference.edited_at || item.reference.editedAt,
                    collectionsList: referenceData.collectionsList,
                    ...referenceData,
                };
            } else {
                console.warn("Reference item missing block_id:", item);
                continue;
            }
        } else if (item.item_type === "api") {
            if (item.api && item.api.block_id) {
                const apiData = await getApiBlockData(item.api.block_id);

                result[item.api.name] = {
                    type: "api_block",
                    label: item.api.label,
                    description: item.api.description,
                    block_id: item.api.block_id,
                    name: item.api.name,
                    scope: item.api.scope,
                    block_type: item.api.block_type,
                    created_at: item.api.created_at || item.api.createdAt,
                    edited_at: item.api.edited_at || item.api.editedAt,
                    url: apiData.url,
                    response: apiData.response,
                    ...apiData,
                };
            } else {
                console.warn("API item missing block_id:", item);
                continue;
            }
        }
    }

    return result;
}

apiService.get("/api/page/:page_id", async (req, res) => {
    try {
        const { page_id } = req.params;
        const page = await getPageDatById(page_id);
        const formattedData = await getPageItemsData(page);
        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching page data:", error);
        res.status(500).json({ error: "Failed to fetch page data" });
    }
});
