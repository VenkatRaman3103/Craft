import express from "express";
import { db } from "../server.js";
import { groups } from "../../db/schema/Groups/schema.js";

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
groupsRouter.get("/groups/all", async (req, res) => {
    try {
        const response = await db.select().from(groups);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "groupsRouter/POST -> /groups/all",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// update
// delete
