import express from "express";
import { db } from "../../server.js";
import { apiBlocks } from "../../../db/schema/blocks/apiBlocks/schema.js";

export const apiBlockRouter = express.Router();

apiBlockRouter.post("/api", async (req, res) => {
    const { name } = req.body;
    try {
        const newApiBlock = await db
            .insert(apiBlocks)
            .values([
                {
                    name,
                },
            ])
            .returning();
        res.json(newApiBlock[0]);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/apiBlock/POST",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.get("/api/:block_id", async (req, res) => {
    const { block_id } = req.params;
    try {
        const newApiBlock = await db.query.apiBlocks.findFirst({
            where: (apiBlocks, { eq }) => eq(apiBlocks.block_id, block_id),
        });
        console.log(newApiBlock, block_id, "some");
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/apiBlock/POST",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.get("/api", async (req, res) => {
    try {
        const newApiBlock = await db.select().from(apiBlocks);
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in creating the block`,
            origin: "backend/apiBlock/POST",
        };
        res.status(500).json(errorMessage);
    }
});
