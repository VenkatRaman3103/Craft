import { eq } from "drizzle-orm";
import { block_items, blocks } from "../../db/schema/blocks.js";
import { db } from "../server.js";

export async function deleteBlockById(req, res) {
    const { block_id } = req.params;
    try {
        const deletedBlock = await db
            .delete(blocks)
            .where(eq(blocks.block_id, block_id))
            .returning();

        res.json(deletedBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in deleting the block: ${block_id}`,
            origin: "backend/blocksRouter/DELETE",
        };
        if (error.code === "P2002") {
            res.status(400).json(errorMessage);
        }
        res.status(500).json(errorMessage);
    }
}

export async function deleteBlockByReference(req, res) {
    const { reference_id } = req.params;
    try {
        const deletedBlock = await db
            .delete(block_items)
            .where(eq(block_items.reference_id, reference_id))
            .returning();

        res.json(deletedBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in deleting the block: ${reference_id}`,
            origin: "backend/blocksRouter/DELETE",
        };
        if (error.code === "P2002") {
            res.status(400).json(errorMessage);
        }
        res.status(500).json(errorMessage);
    }
}
