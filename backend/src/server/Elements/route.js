import express from "express";
import { elements } from "../../db/schema/Elements/schema.js";
import { db } from "../server.js";
import { eq } from "drizzle-orm";

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

// specific element
ElementsRouter.get("/elements/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .select()
            .from(elements)
            .where(eq(elements.id, id));

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

ElementsRouter.get("/elements/:parent_col_id/collections", async (req, res) => {
    const { parent_col_id } = req.params;

    try {
        const response = await db
            .select()
            .from(elements)
            .where(eq(elements.parent_col_id, parent_col_id));

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
    const { name, parent_col_id, type } = req.body;

    try {
        const response = await db
            .insert(elements)
            .values({
                name,
                type,
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
