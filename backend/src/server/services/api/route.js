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

function processFieldItem(item, fieldNameCounts) {
    const fieldTypes = [
        "text_field",
        "textarea_field",
        "number_field",
        "multi_select",
        "single_select",
        "color_picker_field",
        "date_field",
        "email_field",
        "json_field",
        "url_field",
    ];

    for (const fieldType of fieldTypes) {
        if (item.item_type === fieldType && item[fieldType]) {
            let fieldName = item[fieldType].name;

            if (fieldNameCounts[fieldName]) {
                fieldNameCounts[fieldName]++;
                fieldName = `${fieldName}_${fieldNameCounts[fieldName]}`;
            } else {
                fieldNameCounts[fieldName] = 1;
            }

            const fieldData = {
                type: fieldType,
                label: item[fieldType].label,
                required: item[fieldType].required,
                scope: item[fieldType].scope,
                description: item[fieldType].description,
                created_at: item[fieldType].created_at,
                edited_at: item[fieldType].edited_at,
            };

            if (item[fieldType].value !== undefined) {
                fieldData.value = item[fieldType].value;
            }
            if (item[fieldType].options) {
                fieldData.options = item[fieldType].options;
            }
            if (item[fieldType].url_type) {
                fieldData.url_type = item[fieldType].url_type;
            }
            if (fieldType === "color_picker_field") {
                fieldData.hex = item[fieldType].hex;
                fieldData.rgb = item[fieldType].rgb;
                fieldData.rgba = item[fieldType].rgba;
                fieldData.hsl = item[fieldType].hsl;
                fieldData.hsla = item[fieldType].hsla;
            }

            return { fieldName, fieldData };
        }
    }
    return null;
}

async function getPageItemsData(data) {
    const pageItems = data.page_items;
    const result = [];
    const fieldNameCounts = {};

    for (const item of pageItems) {
        let itemData = null;

        if (item.item_type === "normal") {
            if (item.normal && item.normal.block_id) {
                const temp = await getBlockWithNestedContent(
                    item.normal.block_id,
                );
                const formattedData = await formatData(temp);
                if (formattedData) {
                    const blockName = Object.keys(formattedData)[0];
                    itemData = {
                        name: blockName,
                        ...formattedData[blockName],
                    };
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

                itemData = {
                    name: item.array.name,
                    type: "array_block",
                    label: item.array.label,
                    description: item.array.description,
                    block_id: item.array.block_id,
                    scope: item.array.scope,
                    block_type: item.array.block_type,
                    created_at: item.array.created_at || item.array.createdAt,
                    edited_at: item.array.edited_at || item.array.editedAt,
                    items: templatesData,
                };
            } else {
                console.warn("Array item missing block_id:", item);
                continue;
            }
        } else if (item.item_type === "table") {
            if (item.table && item.table.block_id) {
                const tableData = await getTableData(item.table.block_id);

                itemData = {
                    name: item.table.name,
                    type: "table_block",
                    label: item.table.label,
                    description: item.table.description,
                    block_id: item.table.block_id,
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

                itemData = {
                    name: item.reference.name,
                    type: "reference_block",
                    label: item.reference.label,
                    description: item.reference.description,
                    block_id: item.reference.block_id,
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

                itemData = {
                    name: item.api.name,
                    type: "api_block",
                    label: item.api.label,
                    description: item.api.description,
                    block_id: item.api.block_id,
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
        } else {
            const fieldResult = processFieldItem(item, fieldNameCounts);
            if (fieldResult) {
                itemData = {
                    name: fieldResult.fieldName,
                    ...fieldResult.fieldData,
                };
            } else {
                console.warn(
                    "Unknown item type or missing data:",
                    item.item_type,
                    item,
                );
                continue;
            }
        }

        if (itemData) {
            result.push(itemData);
        }
    }

    return result;
}

apiService.get("/api/page/:page_id", async (req, res) => {
    try {
        const { page_id } = req.params;
        const {
            type,
            scope,
            limit,
            offset,
            sort,
            order,
            search,
            required,
            fields,
            exclude_empty,
            date_from,
            date_to,
            include_nested,
            format,
        } = req.query;

        const page = await getPageDatById(page_id);
        let formattedData = await getPageItemsData(page);

        if (type) {
            const types = type.split(",");
            formattedData = formattedData.filter((item) =>
                types.includes(item.type),
            );
        }

        if (scope) {
            formattedData = formattedData.filter(
                (item) => item.scope === scope,
            );
        }

        if (required !== undefined) {
            const isRequired = required === "true";
            formattedData = formattedData.filter(
                (item) =>
                    item.required !== undefined && item.required === isRequired,
            );
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            formattedData = formattedData.filter((item) => {
                const name = (item.name || "").toLowerCase();
                const label = (item.label || "").toLowerCase();
                const description = (item.description || "").toLowerCase();
                return (
                    name.includes(searchTerm) ||
                    label.includes(searchTerm) ||
                    description.includes(searchTerm)
                );
            });
        }

        if (date_from) {
            const fromDate = new Date(date_from);
            formattedData = formattedData.filter(
                (item) =>
                    item.created_at && new Date(item.created_at) >= fromDate,
            );
        }

        if (date_to) {
            const toDate = new Date(date_to);
            formattedData = formattedData.filter(
                (item) =>
                    item.created_at && new Date(item.created_at) <= toDate,
            );
        }

        if (exclude_empty === "true") {
            formattedData = formattedData.filter((item) => {
                if (item.value !== undefined) {
                    return item.value !== null && item.value !== "";
                }
                return true;
            });
        }

        if (sort) {
            const sortField = sort;
            const sortOrder = order === "desc" ? -1 : 1;

            formattedData.sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                if (sortField.includes("_at")) {
                    aVal = new Date(aVal || 0);
                    bVal = new Date(bVal || 0);
                }

                if (typeof aVal === "string" && typeof bVal === "string") {
                    return aVal.localeCompare(bVal) * sortOrder;
                }

                if (aVal < bVal) return -1 * sortOrder;
                if (aVal > bVal) return 1 * sortOrder;
                return 0;
            });
        }

        const startIndex = offset ? parseInt(offset) : 0;
        const endIndex = limit ? startIndex + parseInt(limit) : undefined;

        if (startIndex > 0 || endIndex !== undefined) {
            formattedData = formattedData.slice(startIndex, endIndex);
        }

        if (fields) {
            const selectedFields = fields.split(",");
            formattedData = formattedData.map((item) => {
                const filteredItem = {};
                selectedFields.forEach((field) => {
                    if (item[field] !== undefined) {
                        filteredItem[field] = item[field];
                    }
                });
                return filteredItem;
            });
        }

        let response = formattedData;

        if (format === "grouped") {
            response = formattedData.reduce((acc, item) => {
                const type = item.type || "unknown";
                if (!acc[type]) acc[type] = [];
                acc[type].push(item);
                return acc;
            }, {});
        } else if (format === "flat") {
            response = formattedData.map((item) => {
                const flattened = { ...item };
                delete flattened.collectionsList;
                delete flattened.columns;
                delete flattened.rows;
                delete flattened.grid;
                return flattened;
            });
        }

        const metadata = {
            total: formattedData.length,
            page_id,
            filters_applied: {
                type: type || null,
                scope: scope || null,
                search: search || null,
                required: required || null,
                date_from: date_from || null,
                date_to: date_to || null,
            },
        };

        res.json({
            data: response,
            metadata,
        });
    } catch (error) {
        console.error("Error fetching page data:", error);
        res.status(500).json({ error: "Failed to fetch page data" });
    }
});
