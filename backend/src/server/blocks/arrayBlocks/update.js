import { eq } from "drizzle-orm";
import { arrayBlocks } from "../../../db/schema/blocks/arrayBlocks/schema.js";
import { db } from "../../server.js";

export async function updateArrayBlock(req, res) {
    const { block_id } = req.params;
    try {
        const { name, description, block_type } = req.body;
        const arrayBlockResponse = await db
            .update(arrayBlocks)
            .set({ name, description, block_type })
            .where(eq(arrayBlocks.block_id, block_id))
            .returning();
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/UPDATE/PUT",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function updateNameArrayBlock(req, res) {
    const { block_id, name } = req.params;
    try {
        const arrayBlockResponse = await db
            .update(arrayBlocks)
            .set({ name })
            .where(eq(arrayBlocks.block_id, block_id))
            .returning();
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/UPDATE/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
