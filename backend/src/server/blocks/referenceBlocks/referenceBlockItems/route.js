import express from "express";
import { db } from "../../../server.js";
import { referenceBlockItems } from "../../../../db/schema/blocks/referenceBlock/referenceBlockItems/schema.js";
import { eq } from "drizzle-orm";

export const referenceBlockItemsRouter = express.Router();

referenceBlockItemsRouter.get("/items/:block_id", async (req, res) => {
    const { block_id } = req.params;

    try {
        const items = await db.query.referenceBlockItems.findMany({
            where: (referenceBlockItems, { eq }) =>
                eq(referenceBlockItems.block_id, block_id),
        });
        res.json(items);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/referenceBlockItems/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
});

referenceBlockItemsRouter.post("/items/:block_id", async (req, res) => {
    const { block_id } = req.params;
    const { pagesList } = req.body;

    try {
        await db
            .delete(referenceBlockItems)
            .where(eq(referenceBlockItems.block_id, block_id));

        if (pagesList && pagesList.length > 0) {
            const itemsToInsert = pagesList.map((page_id) => ({
                item_id: page_id,
                block_id,
            }));

            await db.insert(referenceBlockItems).values(itemsToInsert);
        }
        console.log("success");

        res.json({ success: true, message: "Reference block items updated" });
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/referenceBlockItems/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
});
