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

export const arrayBlocksRouter = express.Router();

// Create a new array block type
arrayBlocksRouter.post("/array-block-types", async (req, res) => {
    try {
        const { name, itemBlockTypeId } = req.body;

        if (!name || !itemBlockTypeId) {
            return res.status(400).json({
                error: "Array block name and item block type ID are required",
            });
        }

        // Check if the item block type exists
        const itemBlockType = await db
            .select()
            .from(blockTypes)
            .where(eq(blockTypes.block_type_id, itemBlockTypeId))
            .limit(1);

        if (itemBlockType.length === 0) {
            return res.status(404).json({ error: "Item block type not found" });
        }

        // Create a new block type for the array
        const newArrayBlockType = await db
            .insert(blockTypes)
            .values({
                name: `Array: ${name}`,
            })
            .returning();

        // Create a field definition to store the item block type ID
        await db.insert(fieldDefinitions).values({
            block_type_id: newArrayBlockType[0].block_type_id,
            name: "itemBlockTypeId",
            label: "Item Block Type ID",
            type: "hidden",
            required: true,
            default_value: itemBlockTypeId,
            order: 0,
        });

        // Create a field definition to store the items (array of item block IDs)
        await db.insert(fieldDefinitions).values({
            block_type_id: newArrayBlockType[0].block_type_id,
            name: "items",
            label: "Items",
            type: "array",
            required: false,
            default_value: [], // Empty array by default
            order: 1,
        });

        res.status(201).json(newArrayBlockType[0]);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Add an item to an array block
arrayBlocksRouter.post("/blocks/:blockId/array-items", async (req, res) => {
    try {
        const { blockId } = req.params;

        // Get the array block
        const arrayBlock = await db
            .select()
            .from(blocks)
            .where(eq(blocks.block_id, blockId))
            .limit(1);

        if (arrayBlock.length === 0) {
            return res.status(404).json({ error: "Array block not found" });
        }

        // Get the item block type ID from the array block's field values
        const itemBlockTypeIdField = await db
            .select()
            .from(fieldValues)
            .innerJoin(
                fieldDefinitions,
                eq(fieldValues.field_def_id, fieldDefinitions.field_def_id),
            )
            .where(
                and(
                    eq(fieldValues.block_id, blockId),
                    eq(fieldDefinitions.name, "itemBlockTypeId"),
                ),
            )
            .limit(1);

        if (itemBlockTypeIdField.length === 0) {
            return res.status(400).json({
                error: "Array block is missing the itemBlockTypeId field",
            });
        }

        const itemBlockTypeId = itemBlockTypeIdField[0].value;

        // Get the items field value
        const itemsField = await db
            .select()
            .from(fieldValues)
            .innerJoin(
                fieldDefinitions,
                eq(fieldValues.field_def_id, fieldDefinitions.field_def_id),
            )
            .where(
                and(
                    eq(fieldValues.block_id, blockId),
                    eq(fieldDefinitions.name, "items"),
                ),
            )
            .limit(1);

        if (itemsField.length === 0) {
            return res.status(400).json({
                error: "Array block is missing the items field",
            });
        }

        // Create a new item block (as a standalone block)
        const newItemBlock = await db
            .insert(blocks)
            .values({
                page_id: arrayBlock[0].page_id,
                block_type_id: itemBlockTypeId,
                order: 0, // Order doesn't matter for item blocks as they're not displayed directly
            })
            .returning();

        // Get field definitions for the item block type
        const fieldDefs = await db
            .select()
            .from(fieldDefinitions)
            .where(eq(fieldDefinitions.block_type_id, itemBlockTypeId));

        // Create default field values for the item block
        for (const fieldDef of fieldDefs) {
            await db.insert(fieldValues).values({
                block_id: newItemBlock[0].block_id,
                field_def_id: fieldDef.field_def_id,
                value: fieldDef.default_value || null,
            });
        }

        // Update the items array to include the new item block ID
        const currentItems = itemsField[0].value || [];
        const updatedItems = [...currentItems, newItemBlock[0].block_id];

        await db
            .update(fieldValues)
            .set({ value: updatedItems })
            .where(
                eq(fieldValues.field_value_id, itemsField[0].field_value_id),
            );

        // Return the new item block with its fields
        const itemBlockWithFields = await getBlockWithFields(
            newItemBlock[0].block_id,
        );
        res.status(201).json(itemBlockWithFields);
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

// Remove an item from an array block
arrayBlocksRouter.delete(
    "/blocks/:blockId/array-items/:itemBlockId",
    async (req, res) => {
        try {
            const { blockId, itemBlockId } = req.params;

            // Get the items field value
            const itemsField = await db
                .select()
                .from(fieldValues)
                .innerJoin(
                    fieldDefinitions,
                    eq(fieldValues.field_def_id, fieldDefinitions.field_def_id),
                )
                .where(
                    and(
                        eq(fieldValues.block_id, blockId),
                        eq(fieldDefinitions.name, "items"),
                    ),
                )
                .limit(1);

            if (itemsField.length === 0) {
                return res.status(400).json({
                    error: "Array block is missing the items field",
                });
            }

            // Update the items array to remove the item block ID
            const currentItems = itemsField[0].value || [];
            const updatedItems = currentItems.filter(
                (id) => id !== itemBlockId,
            );

            await db
                .update(fieldValues)
                .set({ value: updatedItems })
                .where(
                    eq(
                        fieldValues.field_value_id,
                        itemsField[0].field_value_id,
                    ),
                );

            // Delete the item block (cascade will delete its field values)
            await db.delete(blocks).where(eq(blocks.block_id, itemBlockId));

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    },
);

// Reorder items in an array block
arrayBlocksRouter.patch(
    "/blocks/:blockId/array-items/order",
    async (req, res) => {
        try {
            const { blockId } = req.params;
            const { itemOrder } = req.body;

            if (!Array.isArray(itemOrder)) {
                return res.status(400).json({
                    error: "Item order must be an array of item block IDs",
                });
            }

            // Get the items field value
            const itemsField = await db
                .select()
                .from(fieldValues)
                .innerJoin(
                    fieldDefinitions,
                    eq(fieldValues.field_def_id, fieldDefinitions.field_def_id),
                )
                .where(
                    and(
                        eq(fieldValues.block_id, blockId),
                        eq(fieldDefinitions.name, "items"),
                    ),
                )
                .limit(1);

            if (itemsField.length === 0) {
                return res.status(400).json({
                    error: "Array block is missing the items field",
                });
            }

            // Verify that all item IDs in the new order exist in the current items
            const currentItems = itemsField[0].value || [];
            const allItemsExist = itemOrder.every((id) =>
                currentItems.includes(id),
            );
            const containsAllItems = currentItems.length === itemOrder.length;

            if (!allItemsExist || !containsAllItems) {
                return res.status(400).json({
                    error: "New order must contain all and only the existing item IDs",
                });
            }

            // Update the items array with the new order
            await db
                .update(fieldValues)
                .set({ value: itemOrder })
                .where(
                    eq(
                        fieldValues.field_value_id,
                        itemsField[0].field_value_id,
                    ),
                );

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Internal server error: ${error}` });
        }
    },
);

// Get all items in an array block
arrayBlocksRouter.get("/blocks/:blockId/array-items", async (req, res) => {
    try {
        const { blockId } = req.params;

        // Get the items field value
        const itemsField = await db
            .select()
            .from(fieldValues)
            .innerJoin(
                fieldDefinitions,
                eq(fieldValues.field_def_id, fieldDefinitions.field_def_id),
            )
            .where(
                and(
                    eq(fieldValues.block_id, blockId),
                    eq(fieldDefinitions.name, "items"),
                ),
            )
            .limit(1);

        if (itemsField.length === 0) {
            return res.status(400).json({
                error: "Array block is missing the items field",
            });
        }

        const itemBlockIds = itemsField[0].value || [];

        // Get all item blocks with their fields
        const itemBlocks = [];
        for (const itemBlockId of itemBlockIds) {
            const itemBlock = await getBlockWithFields(itemBlockId);
            if (itemBlock) {
                itemBlocks.push(itemBlock);
            }
        }

        res.json(itemBlocks);
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

export default arrayBlocksRouter;
