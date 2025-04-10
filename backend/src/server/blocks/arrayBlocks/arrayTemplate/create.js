import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";

export async function createArrayTemplate(req, res) {
    const { name, array_block_id, array_block_item_id } = req.body;

    try {
        const response = await db.insert(arrayBlockTemplates).values([
            {
                name,
                array_block_id,
                array_block_item_id,
            },
        ]);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/createArrayTemplate/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
