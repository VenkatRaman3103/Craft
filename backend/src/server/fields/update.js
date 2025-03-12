import { eq } from "drizzle-orm";
import {
    textFields,
    multiSelectFields,
    singleSelectFields,
    multiSelectOptions,
    singleSelectOptions,
} from "../../db/schema/fields.js";
import { db } from "../server.js";
import {
    colorPickerFields,
    dateFields,
    emailFields,
    jsonFields,
    numberFields,
    textAreaFields,
    urlFields,
} from "../../db/schema/index.js";

export async function patchUpdateTextField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(textFields)
            .set(updateData)
            .where(eq(textFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Text field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating text field",
            origin: "backend/fieldRouter/text_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateMultiSelectField(req, res) {
    const { field_id } = req.params;
    const { label, options, selectedOptions } = req.body;

    try {
        // 1. Update the label in the main field table
        if (label) {
            await db
                .update(multiSelectFields)
                .set({
                    label: label,
                    edited_at: new Date(),
                })
                .where(eq(multiSelectFields.field_id, field_id));
        }

        // 2. If we have options to update
        if (Array.isArray(options) && options.length > 0) {
            // First, delete existing options
            await db
                .delete(multiSelectOptions)
                .where(eq(multiSelectOptions.field_id, field_id));

            // Prepare new options array
            const optionsToInsert = options
                .map((option, index) => {
                    // Handle both string and object options
                    let optionLabel, optionValue;

                    if (typeof option === "string") {
                        optionLabel = option;
                        optionValue = option;
                    } else if (option && typeof option === "object") {
                        optionLabel = option.label || `Option ${index + 1}`; // Fallback value
                        optionValue = option.value || optionLabel;
                    } else {
                        // Skip invalid options
                        return null;
                    }

                    return {
                        field_id: field_id,
                        label: optionLabel,
                        value: optionValue,
                        is_selected:
                            Array.isArray(selectedOptions) &&
                            (selectedOptions.includes(optionLabel) ||
                                selectedOptions.includes(optionValue)),
                        order: index,
                    };
                })
                .filter((option) => option !== null); // Remove any null items

            // Insert the new options if we have any valid ones
            if (optionsToInsert.length > 0) {
                await db.insert(multiSelectOptions).values(optionsToInsert);
            }
        }

        // Fetch and return updated data
        const updatedField = await db.query.multiSelectFields.findFirst({
            where: eq(multiSelectFields.field_id, field_id),
            with: {
                options: {
                    orderBy: (options, { asc }) => [asc(options.order)],
                },
            },
        });

        res.status(200).json(updatedField);
    } catch (error) {
        console.error("Error updating multi-select field:", error);
        res.status(500).json({
            error: error.message,
            message: "Error in updating multi-select field",
            origin: "backend/fieldRouter/multi_select_field/UPDATE",
        });
    }
}

// Now, let's update the patchUpdateSingleSelectField function to mirror the multi-select behavior
export async function patchUpdateSingleSelectField(req, res) {
    const { field_id } = req.params;
    const { label, options, selectedOption } = req.body;

    try {
        // 1. Update the label in the main field table if provided
        if (label) {
            await db
                .update(singleSelectFields)
                .set({
                    label: label,
                    edited_at: new Date(),
                })
                .where(eq(singleSelectFields.field_id, field_id));
        }

        // 2. If we have options to update
        if (Array.isArray(options) && options.length > 0) {
            // First, delete existing options
            await db
                .delete(singleSelectOptions)
                .where(eq(singleSelectOptions.field_id, field_id));

            // Prepare new options array
            const optionsToInsert = options
                .map((option, index) => {
                    // Handle both string and object options
                    let optionLabel, optionValue;
                    if (typeof option === "string") {
                        optionLabel = option;
                        optionValue = option;
                    } else if (option && typeof option === "object") {
                        optionLabel = option.label || `Option ${index + 1}`; // Fallback value
                        optionValue = option.value || optionLabel;
                    } else {
                        // Skip invalid options
                        return null;
                    }

                    // For single select, only one option should be selected
                    return {
                        option_id: crypto.randomUUID(), // Generate new ID for each option
                        field_id: field_id,
                        label: optionLabel,
                        value: optionValue,
                        is_selected:
                            selectedOption === optionValue ||
                            selectedOption === optionLabel,
                        order: index,
                        created_at: new Date(),
                        edited_at: new Date(),
                    };
                })
                .filter((option) => option !== null); // Remove any null items

            // Insert the new options if we have any valid ones
            if (optionsToInsert.length > 0) {
                await db.insert(singleSelectOptions).values(optionsToInsert);
            }
        }

        // Fetch and return updated data
        const updatedField = await db.query.singleSelectFields.findFirst({
            where: eq(singleSelectFields.field_id, field_id),
            with: {
                options: {
                    orderBy: (options, { asc }) => [asc(options.order)],
                },
            },
        });

        res.status(200).json(updatedField);
    } catch (error) {
        console.error("Error updating single-select field:", error);
        res.status(500).json({
            error: error.message,
            message: "Error in updating single-select field",
            origin: "backend/fieldRouter/single_select_field/UPDATE",
        });
    }
}

export async function patchUpdateNumberField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(numberFields)
            .set(updateData)
            .where(eq(numberFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Number field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating number field",
            origin: "backend/fieldRouter/number_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateEmailField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(emailFields)
            .set(updateData)
            .where(eq(emailFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Email field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating email field",
            origin: "backend/fieldRouter/email_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateDateField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(dateFields)
            .set(updateData)
            .where(eq(dateFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Date field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating date field",
            origin: "backend/fieldRouter/date_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateColorPickerField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(colorPickerFields)
            .set(updateData)
            .where(eq(colorPickerFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res
                .status(404)
                .json({ message: "Color picker field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating color picker field",
            origin: "backend/fieldRouter/color_picker_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateTextareaField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(textAreaFields)
            .set(updateData)
            .where(eq(textAreaFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res
                .status(404)
                .json({ message: "Textarea field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating textarea field",
            origin: "backend/fieldRouter/textarea_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateJsonField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(jsonFields)
            .set(updateData)
            .where(eq(jsonFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "JSON field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating JSON field",
            origin: "backend/fieldRouter/json_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function getUrlFields(req, res) {
    try {
        const response = await db.select().from(urlFields);
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `error in fetching the Url fields`,
            origin: "backend/fieldRouter/url_field/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function createUrlField(req, res) {
    const { label, value, name, type, url_type } = req.body;
    try {
        const response = await db
            .insert(urlFields)
            .values({
                name,
                label,
                value,
                type,
                url_type,
            })
            .returning();

        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: `error in creating the Url fields`,
            origin: "backend/fieldRouter/url_field/POST",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function patchUpdateUrlField(req, res) {
    const { field_id } = req.params;
    const updateData = req.body;
    try {
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        const response = await db
            .update(urlFields)
            .set(updateData)
            .where(eq(urlFields.field_id, field_id));
        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Text field not found" });
        }
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in updating url field",
            origin: "backend/fieldRouter/url_field/UPDATE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
