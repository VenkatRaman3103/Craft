import express from "express";
import { db } from "../server.js";
import { collectionsTable } from "../../db/schema/index.js";
import { subCollectionsTable } from "../../db/schema/index.js";

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
collectionsRouter.get("/collections/:collection_slug", async (req, res) => {
    const { collection_slug } = req.params;

    try {
        let result = {};

        const collection = await db.query.collectionsTable.findFirst({
            where: (collectionsTable, { eq }) =>
                eq(collectionsTable.slug, collection_slug),
        });

        result = { ...collection };

        const allSubCollections = await db.query.subCollectionsTable.findMany({
            where: (subCollectionsTable, { eq }) =>
                eq(subCollectionsTable.parent_collection_id, collection.id),
        });

        const allSubPages = await db.query.subPagesTable.findMany({
            where: (subPagesTable, { eq }) =>
                eq(subPagesTable.parent_collection_id, collection.id),
        });

        const temp = [];

        for (let subCol of allSubCollections) {
            const c = await db.query.collectionsTable.findMany({
                where: (collectionsTable, { eq }) =>
                    eq(collectionsTable.sub_table_id, subCol.id),
            });

            temp.push({ ...subCol, kind: "collections", collections: c });
        }

        for (let subPage of allSubPages) {
            const p = await db.query.pagesTable.findMany({
                where: (pagesTable, { eq }) =>
                    eq(pagesTable.sub_table_id, subPage.id),
            });

            temp.push({ ...subPage, kind: "pages", pages: p });
        }

        result.elements = [...temp];

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch collections" });
    }
});
