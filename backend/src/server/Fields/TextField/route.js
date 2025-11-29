import express from "express";
import { textFields } from "../../../db/schema/Fields/TextFields.js";
import { db } from "../../server.js";
import { eq } from "drizzle-orm";

export const TextFieldRouter = express.Router();

TextFieldRouter.post("/text-field/:section_id", async (req, res) => {
    const { section_id } = req.params;

    const { name, value } = req.body;

    try {
        const response = await db
            .insert(textFields)
            .values({ name, value, section_id })
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextFieldRouter/POST -> /text-field",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

TextFieldRouter.get("/text-field/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .select()
            .from(textFields)
            .where(eq(textFields.id, id));

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextFieldRouter/GET -> /text-field/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

TextFieldRouter.delete("/text-field/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .delete(textFields)
            .where(eq(textFields.id, id))
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextFieldRouter/DELETE -> /text-field/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});

TextFieldRouter.patch("/text-field/:id", async (req, res) => {
    const { id } = req.params;

    const { name, value } = req.body;

    try {
        const updateData = {
            ...(name !== undefined && name),
            ...(value !== undefined && value),
        };

        const response = await db
            .update(textFields)
            .set(updateData)
            .where(eq(textFields.id, id))
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextFieldRouter/DELETE -> /text-field/:id",
            error: error,
        };

        console.log(errorMessage);

        res.json(errorMessage);
    }
});
