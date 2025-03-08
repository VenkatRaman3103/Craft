import {
    multiSelectFields,
    multiSelectOptions,
    singleSelectFields,
    singleSelectOptions,
    textFields,
} from "../../db/schema/fields.js";
import { emailFields, numberFields } from "../../db/schema/index.js";
import { db } from "../server.js";

// 🟢 Create text field
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

// 🟢 Create multi-select field
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

// 🟢 Create single-select field
export async function createSingleSelectField(req, res) {
    try {
        const { name, label, options, is_selected } = req.body;

        const fieldResponse = await db
            .insert(singleSelectFields)
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

            await db.insert(singleSelectOptions).values(optionInserts);
        }

        res.status(201).json(fieldResponse);
    } catch (error) {
        console.error("Error creating single_select_field:", error);
        res.status(500).json({ error: "Failed to create singe_select_field" });
    }
}

// 🟢 Get number field
export async function createNumberField(req, res) {
    try {
        const { name, label, type, value } = req.body;

        const response = await db
            .insert(numberFields)
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
            message: "Error in creating number field",
            origin: "backend/fieldRouter/number/POST",
        };
        res.status(500).json(errorMessage);
    }
}

// 🟢 Get all text fields
export async function createEmailField(req, res) {
    try {
        const { name, label, type, value } = req.body;

        const response = await db
            .insert(emailFields)
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
            message: "Error in creating email field",
            origin: "backend/fieldRouter/email/POST",
        };
        res.status(500).json(errorMessage);
    }
}
