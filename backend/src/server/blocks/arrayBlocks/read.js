import { eq } from "drizzle-orm";
import { arrayBlocks } from "../../../db/schema/blocks.js";
import { db } from "../../server.js";

export function getArrayBlocks() {
    return async (req, res) => {
        try {
            const arrayBlocksResponse = await db.select().from(arrayBlocks);
            res.json(arrayBlocksResponse);
        } catch (error) {
            const errorMessage = {
                error: error.message,
                origin: "backend/arrayBlocks/read/GET",
            };
            console.log(errorMessage);
            res.status(500).json(errorMessage);
        }
    };
}

export async function getArrayBlocksById(req, res) {
        try {
            const { block_id } = req.params;
            const arrayBlockResponse = await db
                .select()
                .from(arrayBlocks)
                .where(eq(arrayBlocks.block_id, block_id));
            res.json(arrayBlockResponse);
        } catch (error) {
            const errorMessage = {
                error: error.message,
                origin: "backend/arrayBlocks/read/GET",
            };
            console.log(errorMessage);
            res.status(500).json(errorMessage);
        }
    }
