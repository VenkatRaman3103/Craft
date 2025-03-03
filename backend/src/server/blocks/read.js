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
