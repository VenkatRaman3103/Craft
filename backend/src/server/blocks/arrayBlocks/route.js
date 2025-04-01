import express from "express";
import { db } from "../../server.js";
import { arrayBlocks } from "../../../db/schema/blocks.js";

export const arrayBlocksRouter = express.Router();

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
