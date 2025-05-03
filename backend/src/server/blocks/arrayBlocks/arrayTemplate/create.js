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
    colorPickerFields,
    multiSelectFields,
    multiSelectOptions,
    singleSelectFields,
    singleSelectOptions,
    apiBlocks,
    referenceBlock,
    referenceBlockItems,
    tableBlocks,
    tableRows,
    tableColumns,
    tableEntries,
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
        const tableRowMap = new Map();
        const tableColumnMap = new Map();

        // Recursively duplicate the block items and their children
        const result = await duplicateBlockItemsRecursively(
            rootBlockItems,
            newTemplate,
            null,
            blockMap,
            templateMap,
            fieldMap,
            tableRowMap,
            tableColumnMap,
        );

        res.json({
            newTemplate,
            duplicatedItems: result,
            blockMap: Object.fromEntries(blockMap),
            templateMap: Object.fromEntries(templateMap),
            fieldMap: Object.fromEntries(fieldMap),
            tableRowMap: Object.fromEntries(tableRowMap),
            tableColumnMap: Object.fromEntries(tableColumnMap),
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
 * @param {Map} tableRowMap - Map of original table row IDs to duplicated row IDs
 * @param {Map} tableColumnMap - Map of original table column IDs to duplicated column IDs
 * @returns {Promise<Array>} - Array of duplicated items
 */
async function duplicateBlockItemsRecursively(
    blockItems,
    parentTemplate,
    parentBlockId = null,
    blockMap = new Map(),
    templateMap = new Map(),
    fieldMap = new Map(),
    tableRowMap = new Map(),
    tableColumnMap = new Map(),
) {
    if (!blockItems || blockItems.length === 0) {
        return [];
    }

    const results = [];

    for (const blockItem of blockItems) {
        try {
            // Handle different item types: normal block, array block, api block, reference block, table block, or field
            if (
                blockItem.item_type === "normal" ||
                blockItem.item_type === "array" ||
                blockItem.item_type === "api" ||
                blockItem.item_type === "reference" ||
                blockItem.item_type === "table"
            ) {
                // Get the original block based on type
                let originalBlock;

                switch (blockItem.item_type) {
                    case "normal":
                        originalBlock = await db.query.blocks.findFirst({
                            where: (blocks, { eq }) =>
                                eq(blocks.block_id, blockItem.reference_id),
                        });
                        break;
                    case "array":
                        originalBlock = await db.query.arrayBlocks.findFirst({
                            where: (arrayBlocks, { eq }) =>
                                eq(
                                    arrayBlocks.block_id,
                                    blockItem.reference_id,
                                ),
                        });
                        break;
                    case "api":
                        originalBlock = await db.query.apiBlocks.findFirst({
                            where: (apiBlocks, { eq }) =>
                                eq(apiBlocks.block_id, blockItem.reference_id),
                        });
                        break;
                    case "reference":
                        originalBlock = await db.query.referenceBlock.findFirst(
                            {
                                where: (referenceBlock, { eq }) =>
                                    eq(
                                        referenceBlock.block_id,
                                        blockItem.reference_id,
                                    ),
                            },
                        );
                        break;
                    case "table":
                        originalBlock = await db.query.tableBlocks.findFirst({
                            where: (tableBlocks, { eq }) =>
                                eq(
                                    tableBlocks.block_id,
                                    blockItem.reference_id,
                                ),
                        });
                        break;
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

                    switch (blockItem.item_type) {
                        case "normal":
                            newBlock = await db.query.blocks.findFirst({
                                where: (blocks, { eq }) =>
                                    eq(blocks.block_id, duplicatedBlockId),
                            });
                            break;
                        case "array":
                            newBlock = await db.query.arrayBlocks.findFirst({
                                where: (arrayBlocks, { eq }) =>
                                    eq(arrayBlocks.block_id, duplicatedBlockId),
                            });
                            break;
                        case "api":
                            newBlock = await db.query.apiBlocks.findFirst({
                                where: (apiBlocks, { eq }) =>
                                    eq(apiBlocks.block_id, duplicatedBlockId),
                            });
                            break;
                        case "reference":
                            newBlock = await db.query.referenceBlock.findFirst({
                                where: (referenceBlock, { eq }) =>
                                    eq(
                                        referenceBlock.block_id,
                                        duplicatedBlockId,
                                    ),
                            });
                            break;
                        case "table":
                            newBlock = await db.query.tableBlocks.findFirst({
                                where: (tableBlocks, { eq }) =>
                                    eq(tableBlocks.block_id, duplicatedBlockId),
                            });
                            break;
                    }

                    console.log(
                        `Reusing existing duplicate of ${originalBlock.block_id} -> ${duplicatedBlockId}`,
                    );
                } else {
                    // Create a new duplicate based on block type
                    switch (blockItem.item_type) {
                        case "normal":
                            [newBlock] = await db
                                .insert(blocks)
                                .values([
                                    {
                                        name: originalBlock.name,
                                        block_type: originalBlock.block_type,
                                        description: originalBlock.description,
                                    },
                                ])
                                .returning();
                            break;
                        case "array":
                            [newBlock] = await db
                                .insert(arrayBlocks)
                                .values([
                                    {
                                        name: originalBlock.name,
                                        block_type: originalBlock.block_type,
                                        description: originalBlock.description,
                                    },
                                ])
                                .returning();
                            break;
                        case "api":
                            [newBlock] = await db
                                .insert(apiBlocks)
                                .values([
                                    {
                                        name: originalBlock.name,
                                        block_type: originalBlock.block_type,
                                        description: originalBlock.description,
                                        url: originalBlock.url,
                                        response: originalBlock.response,
                                        scope: originalBlock.scope,
                                    },
                                ])
                                .returning();
                            break;
                        case "reference":
                            [newBlock] = await db
                                .insert(referenceBlock)
                                .values([
                                    {
                                        name: originalBlock.name,
                                        block_type: originalBlock.block_type,
                                        description: originalBlock.description,
                                        reference_type:
                                            originalBlock.reference_type,
                                        collection_id:
                                            originalBlock.collection_id,
                                        scope: originalBlock.scope,
                                    },
                                ])
                                .returning();

                            // Also duplicate reference block items if any
                            const referenceItems =
                                await db.query.referenceBlockItems.findMany({
                                    where: (referenceBlockItems, { eq }) =>
                                        eq(
                                            referenceBlockItems.block_id,
                                            originalBlock.block_id,
                                        ),
                                });

                            for (const refItem of referenceItems) {
                                await db.insert(referenceBlockItems).values([
                                    {
                                        block_id: newBlock.block_id,
                                    },
                                ]);
                            }
                            break;
                        case "table":
                            [newBlock] = await db
                                .insert(tableBlocks)
                                .values([
                                    {
                                        name: originalBlock.name,
                                        block_type: originalBlock.block_type,
                                        description: originalBlock.description,
                                        scope: originalBlock.scope,
                                    },
                                ])
                                .returning();

                            // Duplicate table structure (rows and columns) and data
                            await duplicateTableStructure(
                                originalBlock.block_id,
                                newBlock.block_id,
                                tableRowMap,
                                tableColumnMap,
                            );
                            break;
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
                                tableRowMap,
                                tableColumnMap,
                            );
                        }
                    }
                }

                // For normal blocks, find and duplicate their children
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
                            // Handle block or array block or other block types
                            let childBlock;
                            switch (childItem.item_type) {
                                case "normal":
                                    childBlock =
                                        await db.query.blocks.findFirst({
                                            where: (blocks, { eq }) =>
                                                eq(
                                                    blocks.block_id,
                                                    childItem.reference_id,
                                                ),
                                        });
                                    break;
                                case "array":
                                    childBlock =
                                        await db.query.arrayBlocks.findFirst({
                                            where: (arrayBlocks, { eq }) =>
                                                eq(
                                                    arrayBlocks.block_id,
                                                    childItem.reference_id,
                                                ),
                                        });
                                    break;
                                case "api":
                                    childBlock =
                                        await db.query.apiBlocks.findFirst({
                                            where: (apiBlocks, { eq }) =>
                                                eq(
                                                    apiBlocks.block_id,
                                                    childItem.reference_id,
                                                ),
                                        });
                                    break;
                                case "reference":
                                    childBlock =
                                        await db.query.referenceBlock.findFirst(
                                            {
                                                where: (
                                                    referenceBlock,
                                                    { eq },
                                                ) =>
                                                    eq(
                                                        referenceBlock.block_id,
                                                        childItem.reference_id,
                                                    ),
                                            },
                                        );
                                    break;
                                case "table":
                                    childBlock =
                                        await db.query.tableBlocks.findFirst({
                                            where: (tableBlocks, { eq }) =>
                                                eq(
                                                    tableBlocks.block_id,
                                                    childItem.reference_id,
                                                ),
                                        });
                                    break;
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
                                            tableRowMap,
                                            tableColumnMap,
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
            } else if (
                [
                    "text_field",
                    "textarea_field",
                    "json_field",
                    "number_field",
                    "email_field",
                    "multi_select_field",
                    "date_field",
                    "color_picker_field",
                    "url_field",
                    "single_select_field",
                ].includes(blockItem.item_type)
            ) {
                // For any field type
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
 * Duplicates the structure and data of a table
 * @param {string} originalTableId - The original table ID
 * @param {string} newTableId - The new table ID
 * @param {Map} tableRowMap - Map to track row mappings
 * @param {Map} tableColumnMap - Map to track column mappings
 */
async function duplicateTableStructure(
    originalTableId,
    newTableId,
    tableRowMap,
    tableColumnMap,
) {
    try {
        // 1. Duplicate columns
        const originalColumns = await db.query.tableColumns.findMany({
            where: (tableColumns, { eq }) =>
                eq(tableColumns.table_id, originalTableId),
        });

        for (const originalColumn of originalColumns) {
            const [newColumn] = await db
                .insert(tableColumns)
                .values([
                    {
                        value: originalColumn.value,
                        table_id: newTableId,
                    },
                ])
                .returning();

            tableColumnMap.set(originalColumn.column_id, newColumn.column_id);
        }

        // 2. Duplicate rows
        const originalRows = await db.query.tableRows.findMany({
            where: (tableRows, { eq }) =>
                eq(tableRows.table_id, originalTableId),
        });

        for (const originalRow of originalRows) {
            const [newRow] = await db
                .insert(tableRows)
                .values([
                    {
                        value: originalRow.value,
                        table_id: newTableId,
                    },
                ])
                .returning();

            tableRowMap.set(originalRow.row_id, newRow.row_id);

            // 3. Duplicate entries for this row
            const entries = await db.query.tableEntries.findMany({
                where: (tableEntries, { eq }) =>
                    eq(tableEntries.row_id, originalRow.row_id),
            });

            for (const entry of entries) {
                const newColumnId = tableColumnMap.get(entry.column_id);

                if (newColumnId) {
                    await db.insert(tableEntries).values([
                        {
                            value: entry.value,
                            row_id: newRow.row_id,
                            column_id: newColumnId,
                        },
                    ]);
                }
            }
        }

        console.log(
            `Duplicated table structure for ${originalTableId} -> ${newTableId}`,
        );
    } catch (error) {
        console.error(`Error duplicating table structure: ${error.message}`);
        console.error(error.stack);
    }
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
        // Get the field type from the item_type
        const fieldType = fieldItem.item_type;

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
                            },
                        ])
                        .returning();
                    break;

                case "textarea_field":
                    originalField = await db.query.textAreaFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original textarea field not found for item: ${fieldItem.item_id || "unknown"}`,
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
                            },
                        ])
                        .returning();
                    break;

                case "number_field":
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
                            },
                        ])
                        .returning();
                    break;

                case "json_field":
                    originalField = await db.query.jsonFields.findFirst({
                        where: (jsonFields, { eq }) =>
                            eq(jsonFields.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original json field not found for item: ${fieldItem.item_id || "unknown"}`,
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
                            },
                        ])
                        .returning();
                    break;

                case "email_field":
                    originalField = await db.query.emailFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original email field not found for item: ${fieldItem.item_id || "unknown"}`,
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
                            },
                        ])
                        .returning();
                    break;

                case "multi_select_field":
                    originalField = await db.query.multiSelectFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original multi-select field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    // Create new field
                    [newField] = await db
                        .insert(multiSelectFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                            },
                        ])
                        .returning();

                    // Get options for the original field
                    const originalOptions =
                        await db.query.multiSelectOptions.findMany({
                            where: (options, { eq }) =>
                                eq(options.field_id, originalField.field_id),
                        });

                    console.log(
                        originalOptions,
                        "originalOptions<-------------",
                    );

                    // Duplicate the options for the new field
                    if (originalOptions && originalOptions.length > 0) {
                        await Promise.all(
                            originalOptions.map(async (option, index) => {
                                const some = await db
                                    .insert(multiSelectOptions)
                                    .values([
                                        {
                                            field_id: newField.field_id,
                                            label: option.label,
                                            value: option.value,
                                            display_order: index,
                                        },
                                    ]);
                                console.log(some, "newSome<----------");
                            }),
                        );
                    }
                    break;

                case "date_field":
                    originalField = await db.query.dateFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original date field not found for item: ${fieldItem.item_id || "unknown"}`,
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
                            },
                        ])
                        .returning();
                    break;

                case "color_picker_field":
                    originalField = await db.query.colorPickerFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original color picker field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    [newField] = await db
                        .insert(colorPickerFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                            },
                        ])
                        .returning();
                    break;

                case "url_field":
                    originalField = await db.query.urlFields.findFirst({
                        where: (field, { eq }) =>
                            eq(field.field_id, fieldItem.reference_id),
                    });

                    if (!originalField) {
                        console.log(
                            `Original url field not found for item: ${fieldItem.item_id || "unknown"}`,
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
                            },
                        ])
                        .returning();
                    break;

                case "single_select_field":
                    originalField = await db.query.singleSelectFields.findFirst(
                        {
                            where: (field, { eq }) =>
                                eq(field.field_id, fieldItem.reference_id),
                        },
                    );

                    if (!originalField) {
                        console.log(
                            `Original single-select field not found for item: ${fieldItem.item_id || "unknown"}`,
                        );
                        return null;
                    }

                    // Create new field
                    [newField] = await db
                        .insert(singleSelectFields)
                        .values([
                            {
                                name: originalField.name,
                                label: originalField.label,
                                value: originalField.value,
                                type: originalField.type,
                                required: originalField.required,
                                scope: originalField.scope,
                                description: originalField.description,
                            },
                        ])
                        .returning();

                    // Get options for the original field
                    const originalSingleOptions =
                        await db.query.singleSelectOptions.findMany({
                            where: (options, { eq }) =>
                                eq(options.field_id, originalField.field_id),
                        });

                    // Duplicate the options for the new field
                    if (
                        originalSingleOptions &&
                        originalSingleOptions.length > 0
                    ) {
                        await Promise.all(
                            originalSingleOptions.map(async (option) => {
                                await db.insert(singleSelectOptions).values([
                                    {
                                        field_id: newField.field_id,
                                        label: option.label,
                                        value: option.value,
                                        color: option.color,
                                    },
                                ]);
                            }),
                        );
                    }
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
