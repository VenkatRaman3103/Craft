import {
    multiSelectFields,
    multiSelectOptions,
    textFields,
} from "../../db/schema/fields.js";
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

export async function createMultiSelectField(req, res) {
    try {
        const { name, label, options, is_selected } = req.body;

        const fieldResponse = await db
            .insert(multiSelectFields)
            .values({
                name,
                label,
            })
            .returning();

        const fieldId = fieldResponse[0].field_id;

        if (Array.isArray(options) && options.length > 0) {
            const optionInserts = options.map((option, index) => ({
                field_id: fieldId,
                label: option,
                value: option,
                is_selected:
                    Array.isArray(is_selected) && is_selected.includes(option),
                order: index,
            }));

            await db.insert(multiSelectOptions).values(optionInserts);
        }

        res.status(201).json(fieldResponse);
    } catch (error) {
        console.error("Error creating multi-select field:", error);
        res.status(500).json({ error: "Failed to create multi-select field" });
    }
}
