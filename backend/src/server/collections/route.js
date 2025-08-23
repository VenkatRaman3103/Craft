import express from "express";
import { db } from "../server.js";
import { collectionsTable } from "../../db/schema/index.js";

export const collectionsRouter = express.Router();

// get all root collections
collectionsRouter.get("/collections/root", async (req, res) => {
    try {
        const allRootCollections = await db.select().from(collectionsTable);
        // const allSubCollections = await db.select().from(subCollectionsTable);

        const rootCollections = allRootCollections.filter(
            (col) => col.parent_collection_id == null,
        );

        res.json(rootCollections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch collections" });
    }
});

// get sub collections based on the collection id
collectionsRouter.get("/collections/:collectionId", async (req, res) => {
    //
});
