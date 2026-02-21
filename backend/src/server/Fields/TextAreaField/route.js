import express from "express";
// import { textFields } from "../../../db/schema/Fields/TextFields.js";
import { textareaFields } from "../../../db/schema/index.js";
import { db } from "../../server.js";
import { eq } from "drizzle-orm";

export const TextAreaFieldRouter = express.Router();

// Create a new textarea field in a specific section
TextAreaFieldRouter.post("/textarea-field/:section_id", async (req, res) => {
    const { section_id } = req.params;
    const { name, value } = req.body;

    try {
        const response = await db
            .insert(textareaFields)
            .values({ name, value, section_id })
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextAreaFieldRouter/POST -> /textarea-field",
            error,
        };
        console.log(errorMessage);
        res.json(errorMessage);
    }
});

// Get a textarea field by its ID
TextAreaFieldRouter.get("/textarea-field/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .select()
            .from(textFields)
            .where(eq(textFields.id, id));

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextAreaFieldRouter/GET -> /textarea-field/:id",
            error,
        };
        console.log(errorMessage);
        res.json(errorMessage);
    }
});

// Delete a textarea field by its ID
TextAreaFieldRouter.delete("/textarea-field/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db
            .delete(textFields)
            .where(eq(textFields.id, id))
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextAreaFieldRouter/DELETE -> /textarea-field/:id",
            error,
        };
        console.log(errorMessage);
        res.json(errorMessage);
    }
});

// Update a textarea field by its ID
TextAreaFieldRouter.patch("/textarea-field/:id", async (req, res) => {
    const { id } = req.params;
    const { name, value } = req.body;

    // Only update fields that are provided
    const updateData = {
        ...(name !== undefined && { name }),
        ...(value !== undefined && { value }),
    };

    try {
        const response = await db
            .update(textFields)
            .set(updateData)
            .where(eq(textFields.id, id))
            .returning();

        res.json(response);
    } catch (error) {
        const errorMessage = {
            origin: "TextAreaFieldRouter/PATCH -> /textarea-field/:id",
            error,
        };
        console.log(errorMessage);
        res.json(errorMessage);
    }
});

// Get all textarea fields in a specific section
TextAreaFieldRouter.get(
    "/textarea-field/:section_id/section",
    async (req, res) => {
        const { section_id } = req.params;

        try {
            const response = await db
                .select()
                .from(textFields)
                .where(eq(textFields.section_id, section_id));

            res.json(response);
        } catch (error) {
            const errorMessage = {
                origin: "TextAreaFieldRouter/GET -> /textarea-field/:section_id/section",
                error,
            };
            console.log(errorMessage);
            res.json(errorMessage);
        }
    },
);
