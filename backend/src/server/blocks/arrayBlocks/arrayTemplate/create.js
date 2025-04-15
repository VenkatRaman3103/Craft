import { arrayBlockItems } from "../../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";
import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";
import { block_items, blocks } from "../../../../db/schema/blocks.js";
import {
    arrayBlocks,
    dateFields,
    emailFields,
    jsonFields,
    numberFields,
    textAreaFields,
    textFields,
    urlFields,
} from "../../../../db/schema/index.js";
import { eq } from "drizzle-orm";

export async function createArrayTemplate(req, res) {
    const { name, array_block_id, array_block_item_id } = req.body;

    try {
        const response = await db.insert(arrayBlockTemplates).values([
            {
                name,
                array_block_id,
                array_block_item_id,
            },
        ]);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/createArrayTemplate/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function duplicateTheTemplate(req, res) {
    const { template_id } = req.params;

    try {
        const template = await db.query.arrayBlockTemplates.findFirst({
            where: (arrayBlockTemplates, { eq }) =>
                eq(arrayBlockTemplates.template_id, template_id),
        });

        if (!template) {
            throw new Error("Template not found");
        }

        // Create a new template
        const [newTemplate] = await db
            .insert(arrayBlockTemplates)
            .values([
                {
                    name: `duplicate of ${template.name}`,
                    array_block_id: template.array_block_id,
                    array_block_item_id: template.array_block_item_id,
                },
            ])
            .returning();

        // Find all block items that belong to the template
        const rootBlockItems = await db.query.arrayBlockItems.findMany({
            where: (arrayBlockItems, { eq }) =>
                eq(arrayBlockItems.parent_template_id, template.template_id),
        });

        // Map to track already duplicated blocks/fields (original ID -> new ID)
        const blockMap = new Map();
        const templateMap = new Map();
        const fieldMap = new Map();

        // Recursively duplicate the block items and their children
        const result = await duplicateBlockItemsRecursively(
            rootBlockItems,
            newTemplate,
            null,
            blockMap,
            templateMap,
            fieldMap,
        );

        res.json({
            newTemplate,
            duplicatedItems: result,
            blockMap: Object.fromEntries(blockMap),
            templateMap: Object.fromEntries(templateMap),
            fieldMap: Object.fromEntries(fieldMap),
        });
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/duplicateTheTemplate/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

/**
 * Recursively duplicates block items and their children, including fields
 * @param {Array} blockItems - The block items to duplicate
 * @param {Object} parentTemplate - The template that will own the duplicated items
 * @param {string} [parentBlockId=null] - The parent block ID of the duplicated items
 * @param {Map} blockMap - Map of original block IDs to duplicated block IDs
 * @param {Map} templateMap - Map of original template IDs to duplicated template IDs
 * @param {Map} fieldMap - Map of original field IDs to duplicated field IDs
 * @returns {Promise<Array>} - Array of duplicated items
 */
async function duplicateBlockItemsRecursively(
    blockItems,
    parentTemplate,
    parentBlockId = null,
    blockMap = new Map(),
    templateMap = new Map(),
    fieldMap = new Map(),
) {
    if (!blockItems || blockItems.length === 0) {
        return [];
    }

    const results = [];

    for (const blockItem of blockItems) {
        try {
            // Handle different item types: normal block, array block, or field
            if (
                blockItem.item_type === "normal" ||
                blockItem.item_type === "array"
            ) {
                // Get the original block (could be normal or array)
                let originalBlock;
                if (blockItem.item_type === "normal") {
                    originalBlock = await db.query.blocks.findFirst({
                        where: (blocks, { eq }) =>
                            eq(blocks.block_id, blockItem.reference_id),
                    });
                } else if (blockItem.item_type === "array") {
                    originalBlock = await db.query.arrayBlocks.findFirst({
                        where: (arrayBlocks, { eq }) =>
                            eq(arrayBlocks.block_id, blockItem.reference_id),
                    });
                }

                if (!originalBlock) {
                    console.log(
                        `Original block not found for item: ${blockItem.item_id || "unknown"}`,
                    );
                    continue;
                }

                // Check if we've already duplicated this block
                let newBlock;
                if (blockMap.has(originalBlock.block_id)) {
                    // Reuse the existing block duplicate
                    const duplicatedBlockId = blockMap.get(
                        originalBlock.block_id,
                    );
                    if (originalBlock.block_type === "normal") {
                        newBlock = await db.query.blocks.findFirst({
                            where: (blocks, { eq }) =>
                                eq(blocks.block_id, duplicatedBlockId),
                        });
                    } else if (originalBlock.block_type === "array") {
                        newBlock = await db.query.arrayBlocks.findFirst({
                            where: (arrayBlocks, { eq }) =>
                                eq(arrayBlocks.block_id, duplicatedBlockId),
                        });
                    }
                    console.log(
                        `Reusing existing duplicate of ${originalBlock.block_id} -> ${duplicatedBlockId}`,
                    );
                } else {
                    // Create a new duplicate
                    if (originalBlock.block_type === "normal") {
                        const [duplicatedBlock] = await db
                            .insert(blocks)
                            .values([
                                {
                                    name: originalBlock.name,
                                    block_type: originalBlock.block_type,
                                    description: originalBlock.description,
                                },
                            ])
                            .returning();
                        newBlock = duplicatedBlock;
                    } else if (originalBlock.block_type === "array") {
                        const [duplicatedBlock] = await db
                            .insert(arrayBlocks)
                            .values([
                                {
                                    name: originalBlock.name,
                                    block_type: originalBlock.block_type,
                                    description: originalBlock.description,
                                },
                            ])
                            .returning();
                        newBlock = duplicatedBlock;
                    }

                    // Store the mapping for future reference
                    blockMap.set(originalBlock.block_id, newBlock.block_id);
                    console.log(
                        `Created new duplicate of ${originalBlock.block_id} -> ${newBlock.block_id}`,
                    );
                }

                // Create a new array block item that references the duplicated block
                const [newArrayBlockItem] = await db
                    .insert(arrayBlockItems)
                    .values([
                        {
                            parent_block_id:
                                parentBlockId || parentTemplate.array_block_id,
                            parent_template_id: parentTemplate.template_id,
                            reference_id: newBlock.block_id,
                            item_type: newBlock.block_type,
                        },
                    ])
                    .returning();

                results.push(newArrayBlockItem);

                // If the original block is an array block, we need to duplicate its templates
                if (originalBlock.block_type === "array") {
                    // Find all templates of the original array block
                    const originalTemplates =
                        await db.query.arrayBlockTemplates.findMany({
                            where: (arrayBlockTemplates, { eq }) =>
                                eq(
                                    arrayBlockTemplates.array_block_id,
                                    originalBlock.block_id,
                                ),
                        });

                    // Duplicate each template
                    for (const originalTemplate of originalTemplates) {
                        let newChildTemplate;

                        if (templateMap.has(originalTemplate.template_id)) {
                            // Reuse existing template
                            const duplicatedTemplateId = templateMap.get(
                                originalTemplate.template_id,
                            );
                            newChildTemplate =
                                await db.query.arrayBlockTemplates.findFirst({
                                    where: (arrayBlockTemplates, { eq }) =>
                                        eq(
                                            arrayBlockTemplates.template_id,
                                            duplicatedTemplateId,
                                        ),
                                });
                            console.log(
                                `Reusing existing template duplicate of ${originalTemplate.template_id} -> ${duplicatedTemplateId}`,
                            );
                        } else {
                            // Create new template
                            const [tempTemplate] = await db
                                .insert(arrayBlockTemplates)
                                .values([
                                    {
                                        name: originalTemplate.name,
                                        array_block_id: newBlock.block_id,
                                        array_block_item_id:
                                            newArrayBlockItem.item_id,
                                    },
                                ])
                                .returning();
                            newChildTemplate = tempTemplate;
                            templateMap.set(
                                originalTemplate.template_id,
                                newChildTemplate.template_id,
                            );
                            console.log(
                                `Created new template duplicate of ${originalTemplate.template_id} -> ${newChildTemplate.template_id}`,
                            );

                            // Find all block items of the original template
                            const childBlockItems =
                                await db.query.arrayBlockItems.findMany({
                                    where: (arrayBlockItems, { eq }) =>
                                        eq(
                                            arrayBlockItems.parent_template_id,
                                            originalTemplate.template_id,
                                        ),
                                });

                            // Recursively duplicate the child block items
                            await duplicateBlockItemsRecursively(
                                childBlockItems,
                                newChildTemplate,
                                newBlock.block_id,
                                blockMap,
                                templateMap,
                                fieldMap,
                            );
                        }
                    }
                }

                // For both normal and array blocks, find and duplicate their children
                if (originalBlock.block_type === "normal") {
                    // Find all child items of the original block (including fields)
                    const childItems = await db.query.block_items.findMany({
                        where: (block_items, { eq }) =>
                            eq(
                                block_items.parent_block_id,
                                originalBlock.block_id,
                            ),
                    });

                    // For each child item, create a connection in block_items
                    for (const childItem of childItems) {
                        if (childItem.item_type === "field") {
                            // Handle field type
                            await duplicateField(
                                childItem,
                                newBlock.block_id,
                                parentTemplate,
                                fieldMap,
                            );
                        } else {
                            // Handle block or array block
                            let childBlock;
                            if (childItem.item_type === "normal") {
                                childBlock = await db.query.blocks.findFirst({
                                    where: (blocks, { eq }) =>
                                        eq(
                                            blocks.block_id,
                                            childItem.reference_id,
                                        ),
                                });
                            } else if (childItem.item_type === "array") {
                                childBlock =
                                    await db.query.arrayBlocks.findFirst({
                                        where: (arrayBlocks, { eq }) =>
                                            eq(
                                                arrayBlocks.block_id,
                                                childItem.reference_id,
                                            ),
                                    });
                            }

                            if (childBlock) {
                                let duplicatedChildId;

                                // Check if we've already duplicated this child block
                                if (blockMap.has(childBlock.block_id)) {
                                    duplicatedChildId = blockMap.get(
                                        childBlock.block_id,
                                    );
                                    console.log(
                                        `Using existing child block duplicate ${childBlock.block_id} -> ${duplicatedChildId}`,
                                    );
                                } else {
                                    // Create a new duplicate for this child
                                    const childBlockItems = [
                                        {
                                            reference_id: childBlock.block_id,
                                            item_type: childBlock.block_type,
                                        },
                                    ];

                                    // Create a temporary template just for duplication purposes
                                    const [tempTemplate] = await db
                                        .insert(arrayBlockTemplates)
                                        .values([
                                            {
                                                name: "temp_template_for_duplication",
                                                array_block_id:
                                                    parentTemplate.array_block_id,
                                                array_block_item_id:
                                                    parentTemplate.array_block_item_id,
                                            },
                                        ])
                                        .returning();

                                    // Recursively duplicate this child block
                                    const [newChildItem] =
                                        await duplicateBlockItemsRecursively(
                                            childBlockItems,
                                            tempTemplate,
                                            null,
                                            blockMap,
                                            templateMap,
                                            fieldMap,
                                        );

                                    duplicatedChildId =
                                        newChildItem.reference_id;

                                    // Delete the temporary template - use the imported eq function
                                    try {
                                        await db
                                            .delete(arrayBlockTemplates)
                                            .where(
                                                eq(
                                                    arrayBlockTemplates.template_id,
                                                    tempTemplate.template_id,
                                                ),
                                            );
                                    } catch (deleteError) {
                                        console.error(
                                            `Error deleting temporary template: ${deleteError.message}`,
                                        );
                                    }

                                    console.log(
                                        `Created new child block duplicate ${childBlock.block_id} -> ${duplicatedChildId}`,
                                    );
                                }

                                // Connect the duplicated child to the duplicated parent
                                await db.insert(block_items).values([
                                    {
                                        parent_block_id: newBlock.block_id,
                                        reference_id: duplicatedChildId,
                                        item_type: childItem.item_type,
                                    },
                                ]);
                                console.log(
                                    `Connected child block ${duplicatedChildId} to parent ${newBlock.block_id}`,
                                );
                            }
                        }
                    }
                }
            } else if (blockItem.item_type === "text_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "textarea_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "json_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "number_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "email_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "multi_select_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "date_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "color_picker_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "url_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            } else if (blockItem.item_type === "single_select_field") {
                // For array block items that are fields
                await duplicateField(
                    blockItem,
                    parentBlockId || parentTemplate.array_block_id,
                    parentTemplate,
                    fieldMap,
                );
            }
        } catch (error) {
            console.error(
                `Error duplicating block item ${blockItem.item_id || "unknown"}: ${error.message}`,
            );
            console.error(error.stack);
        }
    }

    return results;
}

/**
 * Duplicates a field item and connects it to its parent
 * @param {Object} fieldItem - The field item to duplicate
 * @param {string} parentBlockId - The parent block ID to connect the field to
 * @param {Object} parentTemplate - The parent template
 * @param {Map} fieldMap - Map of original field IDs to duplicated field IDs
 */
async function duplicateField(
    fieldItem,
    parentBlockId,
    parentTemplate,
    fieldMap,
) {
    try {
        // Get the field type from the item_type (e.g., "text", "number", etc.)
        const fieldType = fieldItem.item_type; // This would be "text", "number", etc. instead of "field"

        // Get the original field from the appropriate table based on field type
        let originalField;
        let newField;
        let duplicatedFieldId;

        console.log(fieldItem, "fieldItem");

        // Check if we've already duplicated this field
        if (fieldMap.has(fieldItem.reference_id)) {
            duplicatedFieldId = fieldMap.get(fieldItem.reference_id);
            console.log(
                `Reusing existing ${fieldType} field duplicate ${fieldItem.reference_id} -> ${duplicatedFieldId}`,
            );
        } else {
            // Handle different field types with their own tables
            switch (fieldType) {
                case "text_field":
                    // Get the original text field
                    originalField = await db.query.textFields.findFirst({
                        where: (textFields, { eq }) =>
                            eq(textFields.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original text field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    // Create a new duplicate of the text field
                    [newField] = await db
                        .insert(textFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other text-specific properties
                            },
                        ])
                        .returning();
                    break;

                case "number_field":
                    // Get the original number field
                    originalField = await db.query.numberFields.findFirst({
                        where: (numberFields, { eq }) =>
                            eq(numberFields.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(numberFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;
                case "json_field":
                    // Get the original number field
                    originalField = await db.query.jsonFields.findFirst({
                        where: (jsonFields, { eq }) =>
                            eq(jsonFields.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(jsonFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;

                case "textarea_field":
                    // Get the original number field
                    originalField = await db.query.textAreaFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(textAreaFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;

                case "email_field":
                    // Get the original number field
                    originalField = await db.query.emailFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(emailFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;

                case "date_field":
                    // Get the original number field
                    originalField = await db.query.dateFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(dateFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;

                case "url_field":
                    // Get the original number field
                    originalField = await db.query.urlFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original number field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(urlFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                                // Add any other number-specific properties
                            },
                        ])
                        .returning();
                    break;
                default:
                    console.log(`Unknown field type: ${fieldType}`);
                    return null;
            }

            duplicatedFieldId = newField.field_id;
            fieldMap.set(fieldItem.reference_id, duplicatedFieldId);
            console.log(
                `Created new ${fieldType} field duplicate ${fieldItem.reference_id} -> ${duplicatedFieldId}`,
            );
        }

        // Connect the field to the parent in the appropriate table
        if (fieldItem.parent_template_id) {
            // For array blocks
            const [newArrayBlockItem] = await db
                .insert(arrayBlockItems)
                .values([
                    {
                        parent_block_id: parentBlockId,
                        parent_template_id: parentTemplate.template_id,
                        reference_id: duplicatedFieldId,
                        item_type: fieldType, // Use the specific field type
                    },
                ])
                .returning();
            console.log(
                `Connected ${fieldType} field ${duplicatedFieldId} to parent block ${parentBlockId} via array block item`,
            );
            return newArrayBlockItem;
        } else {
            // For regular blocks
            const [newBlockItem] = await db
                .insert(block_items)
                .values([
                    {
                        parent_block_id: parentBlockId,
                        reference_id: duplicatedFieldId,
                        item_type: fieldType, // Use the specific field type
                    },
                ])
                .returning();
            console.log(
                `Connected ${fieldType} field ${duplicatedFieldId} to parent block ${parentBlockId} via block item`,
            );
            return newBlockItem;
        }
    } catch (error) {
        console.error(`Error duplicating field: ${error.message}`);
        console.error(error.stack);
        return null;
    }
}
