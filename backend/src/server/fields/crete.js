import { textFields } from "../../db/schema/fields.js";
import { db } from "../server.js";

export async function createTextField(req, res) {
    const { name, label, type, value } = req.body;

    try {
        const response = await db
            .insert(textFields)
            .values({
                name,
                label,
                type,
                value,
            })
            .returning();

        res.status(201).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in creating text field",
            origin: "backend/fieldRouter/POST",
        };
        res.status(500).json(errorMessage);
    }
}
