import { eq } from "drizzle-orm";
import { db } from "../../../server.js";
import { arrayBlockItems } from "../../../../db/schema/blocks/arrayBlocks/arrayBlockItems/schema.js";

export async function readArrayBlockItems(req, res) {
    try {
        const { block_id } = req.params;
        const blockItems = await db
            .select()
            .from(arrayBlockItems)
            .where(eq(arrayBlockItems.parent_block_id, block_id));
        res.json(blockItems);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in getting the block`,
            origin: "backend/blocksRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
