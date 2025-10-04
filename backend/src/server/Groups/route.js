import express from "express";
import { db } from "../server.js";
import { groups } from "../../db/schema/Groups/schema.js";
import { eq } from "drizzle-orm";
import { collections } from "../../db/schema/index.js";

export const groupsRouter = express.Router();

groupsRouter.get("/groups", async (_, res) => {
    res.json("hello groupsRouter");
});

// create
groupsRouter.post("/groups", async (req, res) => {
    const { title, description } = req.body;

    try {
        const response = await db
            .insert(groups)
            .values({
                title,
                description,
            })
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/POST",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// read
// all groups
groupsRouter.get("/groups/all", async (req, res) => {
    try {
        const groups_response = await db.select().from(groups);

        const collections_response = await db.select().from(collections);

        const data = [];

        for (let group of groups_response) {
            const children_collections = collections_response.filter(
                (collection) => {
                    return collection.group_id === group.id;
                },
            );

            data.push({
                ...group,
                collections: children_collections,
            });
        }

        res.json(data);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/GET -> /groups/all",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// specific table
groupsRouter.get("/groups/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .select()
            .from(groups)
            .where(eq(groups.id, id));

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/GET -> /groups/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// update
groupsRouter.put("/groups/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const response = await db
            .update(groups)
            .set({ title, description })
            .where(eq(groups.id, id))
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/GET -> /groups/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// delete
groupsRouter.delete("/groups/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .delete(groups)
            .where(eq(groups.id, id))
            .returning();

        res.json(response[0]);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/GET -> /groups/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
