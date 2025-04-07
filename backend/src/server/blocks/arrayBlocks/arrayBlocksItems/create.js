import { arrayBlockItems } from "../../../../db/schema/blocks.js";
import { db } from "../../../server.js";

// TODO: change block_id to parent_block_id
export async function createArrayBlockItem(req, res) {
    const { block_id } = req.params;

    const { reference_id, type } = req.body;

    try {
        const newBlock = await db
            .insert(arrayBlockItems)
            .values({
                parent_block_id: block_id,
                item_type: type,
                reference_id,
                order: "1",
            })
            .returning();
        res.status(201).json(newBlock[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/blocksRouter/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
