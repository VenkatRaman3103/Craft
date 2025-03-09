import {
    multiSelectFields,
    multiSelectOptions,
    singleSelectFields,
    singleSelectOptions,
    textFields,
} from "../../db/schema/fields.js";
import { colorPickerFields } from "../../db/schema/fields/colorPicker.js";
import { jsonFields } from "../../db/schema/fields/jsonField.js";
import { textAreaFields } from "../../db/schema/fields/textArea.js";
import {
    dateFields,
    emailFields,
    numberFields,
} from "../../db/schema/index.js";
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

// 🟢 Create number field
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

// 🟢 Create email field
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

// 🟢 Create date field
export async function createDateField(req, res) {
    try {
        const { name, label, type, value } = req.body;

        const response = await db
            .insert(dateFields)
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

// 🟢 Create color picker field
export async function createColorPickerField(req, res) {
    try {
        const { name, label, type, hex, rgb, rgba, hsl, hsla, value } =
            req.body;

        if (
            !name ||
            !label ||
            !hex ||
            !rgb ||
            !rgba ||
            !hsl ||
            !hsla ||
            !value
        ) {
            return res.status(400).json({
                message: "Missing required fields",
                origin: "backend/fieldRouter/colorPicker/POST",
            });
        }

        const response = await db
            .insert(colorPickerFields)
            .values({
                name,
                label,
                type: type || "color_picker",
                hex,
                rgb,
                rgba,
                hsl,
                hsla,
                value,
            })
            .returning();

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating color picker field:", error);

        const errorMessage = {
            error: error.message,
            message: "Error in creating color picker field",
            origin: "backend/fieldRouter/colorPicker/POST",
        };

        res.status(500).json(errorMessage);
    }
}

// 🟢 Create textarea field
export async function createTextAreaField(req, res) {
    const { name, label, type, value } = req.body;

    try {
        const response = await db
            .insert(textAreaFields)
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
            message: "Error in creating textarea field",
            origin: "backend/fieldRouter/POST",
        };
        res.status(500).json(errorMessage);
    }
}

// 🟢 Create json field
export async function createJsonField(req, res) {
    const { name, label, type, value } = req.body;

    try {
        const response = await db
            .insert(jsonFields)
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
            message: "Error in creating json field",
            origin: "backend/fieldRouter/POST",
        };
        res.status(500).json(errorMessage);
    }
}
