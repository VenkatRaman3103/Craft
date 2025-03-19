import { blocks } from "../../db/schema/blocks.js";
import { db } from "../server.js";

export async function creatBlock(req, res) {
    const { name, description, block_type } = req.body;

    try {
        const newBlock = await db
            .insert(blocks)
            .values({
                name,
                description,
                block_type,
            })
            .returning();
        res.status(201).json(newBlock[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/blocksRouter/POST",
        };
        res.status(500).json(errorMessage);
    }
}

export async function createBlockOnRef(req, res) {
    const { reference_id } = req.params;
    const { name, description = "", scope } = req.body;

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
                description,
                scope,
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
