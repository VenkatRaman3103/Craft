import { arrayBlocks } from "../../../db/schema/blocks.js";
import { db } from "../../server.js";

export async function createArrayBlock(req, res) {
    try {
        const { name, description, block_type } = req.body;
        const arrayBlockResponse = await db
            .insert(arrayBlocks)
            .values({ name, description, block_type })
            .returning();
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
export async function createArrayBlockByRef(req, res) {
    try {
        const { reference_id } = req.params;
        const { name, description, block_type } = req.body;
        const arrayBlockResponse = await db
            .insert(arrayBlocks)
            .values({ reference_id, name, description, block_type })
            .returning();
        res.json(arrayBlockResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/create/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

