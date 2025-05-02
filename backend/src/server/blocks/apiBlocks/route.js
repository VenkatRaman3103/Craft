import express from "express";
import { db } from "../../server.js";
import { apiBlocks } from "../../../db/schema/blocks/apiBlocks/schema.js";
import { eq } from "drizzle-orm";
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
            message: `Error in fetching the block`,
            origin: "backend/apiBlock/GET",
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
            message: `Error in fetching all blocks`,
            origin: "backend/apiBlock/GET_ALL",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.delete("/api/:block_id", async (req, res) => {
    const { block_id } = req.params;
    try {
        const newApiBlock = await db
            .delete(apiBlocks)
            .where(eq(apiBlocks.block_id, block_id))
            .returning();
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in deleting the block`,
            origin: "backend/apiBlock/DELETE",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.patch("/api/:block_id/name", async (req, res) => {
    const { block_id } = req.params;
    const { name } = req.body;
    try {
        const newApiBlock = await db
            .update(apiBlocks)
            .set({
                name,
            })
            .where(eq(apiBlocks.block_id, block_id))
            .returning();
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in updating the block name`,
            origin: "backend/apiBlock/PATCH_NAME",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.patch("/api/:block_id/url", async (req, res) => {
    const { block_id } = req.params;
    const { url } = req.body;
    try {
        const newApiBlock = await db
            .update(apiBlocks)
            .set({
                url,
            })
            .where(eq(apiBlocks.block_id, block_id))
            .returning();
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in updating the block URL`,
            origin: "backend/apiBlock/PATCH_URL",
        };
        res.status(500).json(errorMessage);
    }
});

apiBlockRouter.patch("/api/:block_id/response", async (req, res) => {
    const { block_id } = req.params;
    const { response } = req.body;
    try {
        const newApiBlock = await db
            .update(apiBlocks)
            .set({
                response,
            })
            .where(eq(apiBlocks.block_id, block_id))
            .returning();
        res.json(newApiBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in updating the block response`,
            origin: "backend/apiBlock/PATCH_RESPONSE",
        };
        res.status(500).json(errorMessage);
    }
});
