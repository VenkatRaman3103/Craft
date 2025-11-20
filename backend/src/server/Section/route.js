import express from "express";
import { sections } from "../../db/schema/Sections/schema.js";
import { db } from "../server.js";

export const SectionsRouter = express.Router();

SectionsRouter.post("/sections/:page_id/page", async (req, res) => {
    const { name, type, position } = req.body;
    const { page_id } = req.params;

    console.log(name, type, position, page_id, "<-- sections");

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
