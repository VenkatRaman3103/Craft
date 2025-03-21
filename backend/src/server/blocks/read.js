import { eq } from "drizzle-orm";
import { blocks } from "../../db/schema/blocks.js";
import { db } from "../server.js";

// get all blocks
export async function getAllBlocks(req, res) {
    try {
        const allBlocks = await db.select().from(blocks);
        res.status(200).json(allBlocks);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the blocks`,
            origin: "backend/blocksRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

// get block by id
export async function getBlockById(req, res) {
    const { block_id } = req.params;

    try {
        const block = await db
            .select()
            .from(blocks)
            .where(eq(blocks.block_id, block_id));
        res.status(200).json(block);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the block: ${block_id}`,
            origin: "backend/blocksRouter/GET",
        };

        res.status(500).json(errorMessage);
    }
}

// TODO: instead of formatting the data from response use drizzle-orm ( with functinality )
export async function getBlockWithNestedContent(block_id) {
    if (!block_id) return null;

    const block = await db.query.blocks.findFirst({
        where: (blocks, { eq }) => eq(blocks.block_id, block_id),
    });

    if (!block) return null;

    const items = await db.query.block_items.findMany({
        where: (blockItems, { eq }) => eq(blockItems.parent_block_id, block_id),
        orderBy: (blockItems, { asc }) => asc(blockItems.order),
    });

    const processedItems = await Promise.all(
        items.map(async (item) => {
            if (item.item_type === "text_field") {
                const field = await db.query.textFields.findFirst({
                    where: (textFields, { eq }) =>
                        eq(textFields.field_id, item.reference_id),
                });
                return { item_type: "text_field", text_field: field };
            } else if (item.item_type === "block") {
                const nestedContent = await getBlockWithNestedContent(
                    item.reference_id,
                );
                return { block: nestedContent };
            }

            return null;
        }),
    );

    return { ...block, block_items: processedItems.filter(Boolean) };
}
// Express route handler

export async function getBlockByReference(req, res) {
    const { reference_id } = req.params;
    try {
        const block = await db
            .select()
            .from(blocks)
            .where(eq(blocks.reference_id, reference_id));
        res.status(200).json(block);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in fetching the block: ${reference_id}`,
            origin: "backend/blocksRouter/GET",
        };
        res.status(500).json(errorMessage);
    }
}
