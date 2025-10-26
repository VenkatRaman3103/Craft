import express from "express";
import { elements } from "../../db/schema/Elements/schema.js";
import { db } from "../server.js";

export const ElementsRouter = express.Router();

// read
// all elements
ElementsRouter.get("/elements", async (_, res) => {
    try {
        const response = await db.select().from(elements);

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "elements/GET -> /elements",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// create
// add element
ElementsRouter.post("/elements", async (req, res) => {
    const { name, parent_col_id } = req.body;

    try {
        const response = await db
            .insert(elements)
            .values({
                name,
                parent_col_id,
            })
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "elements/POST -> /elements",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
