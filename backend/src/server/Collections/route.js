import express from "express";
import { db } from "../server.js";
import { collections } from "../../db/schema/Collections/schema.js";
import { eq } from "drizzle-orm";

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

// read
// under groups
collectionsRouter.get("/collections/:group_id/groups", async (req, res) => {
    const { group_id } = req.params;

    try {
        const response = await db
            .select()
            .from(collections)
            .where(eq(collections.group_id, group_id));

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "collections/GET -> /collections/:group_id/groups",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// under collections
collectionsRouter.get(
    "/collections/:collection_id/collections",
    async (req, res) => {
        const { collection_id } = req.params;

        try {
            const response = await db
                .select()
                .from(collections)
                .where(eq(collections.parent_col_id, collection_id));

            res.json(response);
        } catch (error) {
            const errorMessage = {
                origin: "collections/GET -> /collections/:collection_id/collections",
                error: error,
            };

            console.log(errorMessage);

            res.json(errorMessage);
        }
    },
);

// delete
collectionsRouter.delete("/collections/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .delete(collections)
            .where(eq(collections.id, id))
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "collections/GET -> /collections/:collection_id/collections",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// update
collectionsRouter.put("/collections/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, slug } = req.body;

    try {
        const response = await db
            .update(collections)
            .set({ name, description, slug })
            .where(eq(collections.id, id))
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "collections/PUT -> /collections/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
