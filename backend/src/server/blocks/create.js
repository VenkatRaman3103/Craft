import { blocks } from "../../db/schema/blocks.js";
import { db } from "../server.js";

export async function createBlock(req, res) {
    const { reference_id } = req.params;
    const { name, description = "" } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Block name is required",
        });
    }

    try {
        const newBlock = await db
            .insert(blocks)
            .values({
                reference_id,
                name,
                description: description || "",
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
