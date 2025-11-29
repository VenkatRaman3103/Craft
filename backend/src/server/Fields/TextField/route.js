import express from "express";
import { textFields } from "../../../db/schema/Fields/TextFields.js";
import { db } from "../../server.js";

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
