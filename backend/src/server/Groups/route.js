import express from "express";
import { db } from "../server.js";
import { groups } from "../../db/schema/Groups/schema.js";
import { sql } from "drizzle-orm";

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

// reads
// update
// delete
