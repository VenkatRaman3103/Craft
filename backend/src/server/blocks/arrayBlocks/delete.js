import { eq } from "drizzle-orm";
import { arrayBlocks } from "../../../db/schema/blocks/arrayBlocks/schema.js";
import { db } from "../../server.js";

export async function deleteArrayBlock(req, res) {
    const { block_id } = req.params;
    try {
        const arrayBlockResponse = await db
            .delete(arrayBlocks)
            .where(eq(arrayBlocks.block_id, block_id))
            .returning();
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/read/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
