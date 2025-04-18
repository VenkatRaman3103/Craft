import express from "express";
import { getPageDatById } from "../../pages/read.js";
import { getBlockWithNestedContent } from "../../blocks/read.js";
import { getArrayTemplates } from "../../blocks/arrayBlocks/read.js";
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
            } else if (item.item_type === "text_field") {
                const fieldName = item[item.item_type].name;
                blockData[fieldName] = item.text_field.value;

                // blockData[item.name] = {
                //     type: "text_field",
                //     label: item.text_field.label,
                //     value: item.text_field.value,
                //     required: item.text_field.required,
                //     scope: item.text_field.scope,
                //     description: item.text_field.description,
                //     created_at: item.text_field.created_at,
                //     edited_at: item.text_field.edited_at,
                // };
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
            const temp = await getBlockWithNestedContent(item.normal.block_id);
            const formattedData = await formatData(temp);
            if (formattedData) {
                const blockName = Object.keys(formattedData)[0];
                result[blockName] = formattedData[blockName];
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

            result[item.array.name] = {
                type: "array_block",
                items: templatesData,
            };
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
