import express from "express";
import { db } from "../server.js";
import { collectionsTable } from "../../db/schema/index.js";

export const collectionsRouter = express.Router();

collectionsRouter.get("/collections/root", async (req, res) => {
    try {
        const allCollections = await db.select().from(collectionsTable);
        // const allSubCollections = await db.select().from(subCollectionsTable);

        const rootCollections = allCollections.filter(
            (col) => col.parent_collection_id == null,
        );

        res.json(rootCollections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch collections" });
    }
});
