import express from "express";
import { db } from "../server.js";
import { collections } from "../../db/schema/Collections/schema.js";

export const collectionsRouter = express.Router();

// create
// under groups
collectionsRouter.post("/collections/:group_id/groups", async (req, res) => {
    const { group_id } = req.params;
    const { name, description, slug } = req.body;

    try {
        const response = await db
            .insert(collections)
            .values({
                name,
                description,
                slug,
                group_id,
            })
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "collections/POST -> /collections/:group_id/groups",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// under collections
collectionsRouter.post(
    "/collections/:collection_id/collections",
    async (req, res) => {
        const { collection_id } = req.params;
        const { name, description, slug } = req.body;

        try {
            const response = await db
                .insert(collections)
                .values({
                    name,
                    description,
                    slug,
                    parent_col_id: collection_id,
                })
                .returning();

            res.json(response[0]);
        } catch (error) {
            const errorMessage = {
                origin: "collections/POST -> /collections/:collection_id/collections",
                error: error,
            };

            console.log(errorMessage);

            res.json(errorMessage);
        }
    },
);
