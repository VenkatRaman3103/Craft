import express from "express";
import { db } from "../../server.js";
import { arrayBlocks } from "../../../db/schema/blocks.js";
import { eq } from "drizzle-orm";

export const arrayBlocksRouter = express.Router();

// READ
arrayBlocksRouter.get("/arrayblocks", async (req, res) => {
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
});

arrayBlocksRouter.get("/arrayblock/:block_id", async (req, res) => {
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
});
