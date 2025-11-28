import express from "express";
import { sections } from "../../db/schema/Sections/schema.js";
import { db } from "../server.js";
import { eq } from "drizzle-orm";

export const SectionsRouter = express.Router();

SectionsRouter.post("/sections/:page_id/page", async (req, res) => {
    const { name, type, position } = req.body;
    const { page_id } = req.params;

    try {
        const response = await db
            .insert(sections)
            .values({
                name,
                type,
                position,
                parent_page_id: page_id,
            })
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "SectionsRouter/POST",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

// delete section by its id
SectionsRouter.delete("/sections/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .delete(sections)
            .where(eq(sections.id, id))
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "SectionsRouter/DELETE --> /section/id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
