import express from "express";
import { db } from "../server.js";
import {
    blocks,
    blockTypes,
    fieldDefinitions,
    fieldValues,
    pages,
} from "../db/schema/pages.js";
import { eq, and } from "drizzle-orm";

export const blocksRouter = express.Router();

// Get all block types
blocksRouter.get("/block-types", async (req, res) => {
    try {
        const allBlockTypes = await db.select().from(blockTypes);
        res.json(allBlockTypes);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Create a new block type
blocksRouter.post("/block-types", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res
                .status(400)
                .json({ error: "Block type name is required" });
        }

        const newBlockType = await db
            .insert(blockTypes)
            .values({ name })
            .returning();

        res.status(201).json(newBlockType[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Add a block to a page
blocksRouter.post("/pages/:pageId/blocks", async (req, res) => {
    try {
        const { pageId } = req.params;
        const { blockTypeId, order } = req.body;

        if (!blockTypeId) {
            return res.status(400).json({ error: "Block type ID is required" });
        }

        // Check if page exists
        const page = await db
            .select()
            .from(pages)
            .where(eq(pages.page_id, pageId))
            .limit(1);

        if (page.length === 0) {
            return res.status(404).json({ error: "Page not found" });
        }

        // Check if block type exists
        const blockType = await db
            .select()
            .from(blockTypes)
            .where(eq(blockTypes.block_type_id, blockTypeId))
            .limit(1);

        if (blockType.length === 0) {
            return res.status(404).json({ error: "Block type not found" });
        }

        // If order is not provided, get the highest order and add 1
        let blockOrder = order;
        if (blockOrder === undefined) {
            const highestOrderBlock = await db
                .select({ order: blocks.order })
                .from(blocks)
                .where(eq(blocks.page_id, pageId))
                .orderBy(blocks.order, "desc")
                .limit(1);

            blockOrder =
                highestOrderBlock.length > 0
                    ? highestOrderBlock[0].order + 1
                    : 0;
        }

        // Create the block
        const newBlock = await db
            .insert(blocks)
            .values({
                page_id: pageId,
                block_type_id: blockTypeId,
                order: blockOrder,
            })
            .returning();

        // Get the field definitions for this block type
        const fieldDefs = await db
            .select()
            .from(fieldDefinitions)
            .where(eq(fieldDefinitions.block_type_id, blockTypeId));

        // Create default field values based on field definitions
        const fieldValuePromises = fieldDefs.map((fieldDef) =>
            db.insert(fieldValues).values({
                block_id: newBlock[0].block_id,
                field_def_id: fieldDef.field_def_id,
                value: fieldDef.default_value || null,
            }),
        );

        await Promise.all(fieldValuePromises);

        // Return the new block with its fields
        const blockWithFields = await getBlockWithFields(newBlock[0].block_id);
        res.status(201).json(blockWithFields);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Get a block with its fields
blocksRouter.get("/blocks/:blockId", async (req, res) => {
    try {
        const { blockId } = req.params;
        const blockWithFields = await getBlockWithFields(blockId);

        if (!blockWithFields) {
            return res.status(404).json({ error: "Block not found" });
        }

        res.json(blockWithFields);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Update block order
blocksRouter.patch("/blocks/:blockId/order", async (req, res) => {
    try {
        const { blockId } = req.params;
        const { order } = req.body;

        if (order === undefined) {
            return res.status(400).json({ error: "Order is required" });
        }

        const updatedBlock = await db
            .update(blocks)
            .set({ order })
            .where(eq(blocks.block_id, blockId))
            .returning();

        if (updatedBlock.length === 0) {
            return res.status(404).json({ error: "Block not found" });
        }

        res.json(updatedBlock[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Remove a block
blocksRouter.delete("/blocks/:blockId", async (req, res) => {
    try {
        const { blockId } = req.params;

        // Delete the block (cascade will delete field values)
        await db.delete(blocks).where(eq(blocks.block_id, blockId));

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Duplicate a block with or without content
blocksRouter.post("/blocks/:blockId/duplicate", async (req, res) => {
    try {
        const { blockId } = req.params;
        const { withContent = true } = req.body;

        // Get the original block
        const originalBlock = await db
            .select()
            .from(blocks)
            .where(eq(blocks.block_id, blockId))
            .limit(1);

        if (originalBlock.length === 0) {
            return res.status(404).json({ error: "Block not found" });
        }

        // Get the highest order for the current page
        const highestOrderBlock = await db
            .select({ order: blocks.order })
            .from(blocks)
            .where(eq(blocks.page_id, originalBlock[0].page_id))
            .orderBy(blocks.order, "desc")
            .limit(1);

        const newOrder =
            highestOrderBlock.length > 0 ? highestOrderBlock[0].order + 1 : 0;

        // Create the duplicate block
        const duplicatedBlock = await db
            .insert(blocks)
            .values({
                page_id: originalBlock[0].page_id,
                block_type_id: originalBlock[0].block_type_id,
                order: newOrder,
            })
            .returning();

        if (withContent) {
            // Get the original field values
            const originalFieldValues = await db
                .select()
                .from(fieldValues)
                .where(eq(fieldValues.block_id, blockId));

            // Create new field values with the same content
            const fieldValuePromises = originalFieldValues.map((fieldValue) =>
                db.insert(fieldValues).values({
                    block_id: duplicatedBlock[0].block_id,
                    field_def_id: fieldValue.field_def_id,
                    value: fieldValue.value,
                }),
            );

            await Promise.all(fieldValuePromises);
        } else {
            // Get the field definitions for this block type
            const fieldDefs = await db
                .select()
                .from(fieldDefinitions)
                .where(
                    eq(
                        fieldDefinitions.block_type_id,
                        originalBlock[0].block_type_id,
                    ),
                );

            // Create default field values based on field definitions
            const fieldValuePromises = fieldDefs.map((fieldDef) =>
                db.insert(fieldValues).values({
                    block_id: duplicatedBlock[0].block_id,
                    field_def_id: fieldDef.field_def_id,
                    value: fieldDef.default_value || null,
                }),
            );

            await Promise.all(fieldValuePromises);
        }

        // Return the new block with its fields
        const blockWithFields = await getBlockWithFields(
            duplicatedBlock[0].block_id,
        );
        res.status(201).json(blockWithFields);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Field definition CRUD operations

// Add a field definition to a block type
blocksRouter.post("/block-types/:blockTypeId/fields", async (req, res) => {
    try {
        const { blockTypeId } = req.params;
        const { name, label, type, required, defaultValue, options, order } =
            req.body;

        if (!name || !label || !type) {
            return res.status(400).json({
                error: "Field name, label, and type are required",
            });
        }

        // Check if block type exists
        const blockType = await db
            .select()
            .from(blockTypes)
            .where(eq(blockTypes.block_type_id, blockTypeId))
            .limit(1);

        if (blockType.length === 0) {
            return res.status(404).json({ error: "Block type not found" });
        }

        // Get the highest order if not provided
        let fieldOrder = order;
        if (fieldOrder === undefined) {
            const highestOrderField = await db
                .select({ order: fieldDefinitions.order })
                .from(fieldDefinitions)
                .where(eq(fieldDefinitions.block_type_id, blockTypeId))
                .orderBy(fieldDefinitions.order, "desc")
                .limit(1);

            fieldOrder =
                highestOrderField.length > 0
                    ? highestOrderField[0].order + 1
                    : 0;
        }

        // Create the field definition
        const newFieldDef = await db
            .insert(fieldDefinitions)
            .values({
                block_type_id: blockTypeId,
                name,
                label,
                type,
                required: required || false,
                default_value: defaultValue || null,
                options: options || null,
                order: fieldOrder,
            })
            .returning();

        // Find all blocks of this type and create field values for them
        const blocksOfType = await db
            .select()
            .from(blocks)
            .where(eq(blocks.block_type_id, blockTypeId));

        const fieldValuePromises = blocksOfType.map((block) =>
            db.insert(fieldValues).values({
                block_id: block.block_id,
                field_def_id: newFieldDef[0].field_def_id,
                value: newFieldDef[0].default_value || null,
            }),
        );

        await Promise.all(fieldValuePromises);

        res.status(201).json(newFieldDef[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Update a field definition
blocksRouter.patch("/field-definitions/:fieldDefId", async (req, res) => {
    try {
        const { fieldDefId } = req.params;
        const { name, label, type, required, defaultValue, options, order } =
            req.body;

        // Check if field definition exists
        const fieldDef = await db
            .select()
            .from(fieldDefinitions)
            .where(eq(fieldDefinitions.field_def_id, fieldDefId))
            .limit(1);

        if (fieldDef.length === 0) {
            return res
                .status(404)
                .json({ error: "Field definition not found" });
        }

        // Update the field definition
        const updatedFieldDef = await db
            .update(fieldDefinitions)
            .set({
                name: name !== undefined ? name : fieldDef[0].name,
                label: label !== undefined ? label : fieldDef[0].label,
                type: type !== undefined ? type : fieldDef[0].type,
                required:
                    required !== undefined ? required : fieldDef[0].required,
                default_value:
                    defaultValue !== undefined
                        ? defaultValue
                        : fieldDef[0].default_value,
                options: options !== undefined ? options : fieldDef[0].options,
                order: order !== undefined ? order : fieldDef[0].order,
            })
            .where(eq(fieldDefinitions.field_def_id, fieldDefId))
            .returning();

        res.json(updatedFieldDef[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Remove a field definition
blocksRouter.delete("/field-definitions/:fieldDefId", async (req, res) => {
    try {
        const { fieldDefId } = req.params;

        // Delete the field definition (cascade will delete field values)
        await db
            .delete(fieldDefinitions)
            .where(eq(fieldDefinitions.field_def_id, fieldDefId));

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Duplicate a field definition
blocksRouter.post(
    "/field-definitions/:fieldDefId/duplicate",
    async (req, res) => {
        try {
            const { fieldDefId } = req.params;

            // Get the original field definition
            const originalFieldDef = await db
                .select()
                .from(fieldDefinitions)
                .where(eq(fieldDefinitions.field_def_id, fieldDefId))
                .limit(1);

            if (originalFieldDef.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Field definition not found" });
            }

            // Get the highest order for the current block type
            const highestOrderField = await db
                .select({ order: fieldDefinitions.order })
                .from(fieldDefinitions)
                .where(
                    eq(
                        fieldDefinitions.block_type_id,
                        originalFieldDef[0].block_type_id,
                    ),
                )
                .orderBy(fieldDefinitions.order, "desc")
                .limit(1);

            const newOrder =
                highestOrderField.length > 0
                    ? highestOrderField[0].order + 1
                    : 0;

            // Create the duplicate field definition
            const duplicatedFieldDef = await db
                .insert(fieldDefinitions)
                .values({
                    block_type_id: originalFieldDef[0].block_type_id,
                    name: `${originalFieldDef[0].name}_copy`,
                    label: `${originalFieldDef[0].label} (Copy)`,
                    type: originalFieldDef[0].type,
                    required: originalFieldDef[0].required,
                    default_value: originalFieldDef[0].default_value,
                    options: originalFieldDef[0].options,
                    order: newOrder,
                })
                .returning();

            // Find all blocks of this type and create field values for them
            const blocksOfType = await db
                .select()
                .from(blocks)
                .where(
                    eq(blocks.block_type_id, originalFieldDef[0].block_type_id),
                );

            const fieldValuePromises = blocksOfType.map((block) =>
                db.insert(fieldValues).values({
                    block_id: block.block_id,
                    field_def_id: duplicatedFieldDef[0].field_def_id,
                    value: duplicatedFieldDef[0].default_value || null,
                }),
            );

            await Promise.all(fieldValuePromises);

            res.status(201).json(duplicatedFieldDef[0]);
        } catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    },
);

// Field value CRUD operations

// Update a field value
blocksRouter.patch("/blocks/:blockId/fields/:fieldDefId", async (req, res) => {
    try {
        const { blockId, fieldDefId } = req.params;
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({ error: "Field value is required" });
        }

        // Check if the field value exists
        const existingFieldValue = await db
            .select()
            .from(fieldValues)
            .where(
                and(
                    eq(fieldValues.block_id, blockId),
                    eq(fieldValues.field_def_id, fieldDefId),
                ),
            )
            .limit(1);

        if (existingFieldValue.length === 0) {
            // Create a new field value if it doesn't exist
            const newFieldValue = await db
                .insert(fieldValues)
                .values({
                    block_id: blockId,
                    field_def_id: fieldDefId,
                    value,
                })
                .returning();

            return res.status(201).json(newFieldValue[0]);
        }

        // Update the existing field value
        const updatedFieldValue = await db
            .update(fieldValues)
            .set({ value })
            .where(
                and(
                    eq(fieldValues.block_id, blockId),
                    eq(fieldValues.field_def_id, fieldDefId),
                ),
            )
            .returning();

        res.json(updatedFieldValue[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Helper function to get a block with its fields
async function getBlockWithFields(blockId) {
    const block = await db
        .select({
            block_id: blocks.block_id,
            page_id: blocks.page_id,
            block_type_id: blocks.block_type_id,
            block_type_name: blockTypes.name,
            order: blocks.order,
        })
        .from(blocks)
        .innerJoin(
            blockTypes,
            eq(blocks.block_type_id, blockTypes.block_type_id),
        )
        .where(eq(blocks.block_id, blockId))
        .limit(1);

    if (block.length === 0) {
        return null;
    }

    // Get field definitions for this block type
    const fieldDefs = await db
        .select()
        .from(fieldDefinitions)
        .where(eq(fieldDefinitions.block_type_id, block[0].block_type_id))
        .orderBy(fieldDefinitions.order);

    // Get field values for this block
    const values = await db
        .select()
        .from(fieldValues)
        .where(eq(fieldValues.block_id, blockId));

    // Combine field definitions with their values
    const fields = fieldDefs.map((fieldDef) => {
        const fieldValue = values.find(
            (v) => v.field_def_id === fieldDef.field_def_id,
        );
        return {
            field_def_id: fieldDef.field_def_id,
            name: fieldDef.name,
            label: fieldDef.label,
            type: fieldDef.type,
            required: fieldDef.required,
            options: fieldDef.options,
            value: fieldValue ? fieldValue.value : fieldDef.default_value,
        };
    });

    return {
        ...block[0],
        fields,
    };
}

export default blocksRouter;
