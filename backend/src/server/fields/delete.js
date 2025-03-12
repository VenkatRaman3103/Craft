import { eq } from "drizzle-orm";
import { db } from "../server.js";
import {
    multiSelectFields,
    singleSelectFields,
    textFields,
} from "../../db/schema/fields.js";
import {
    colorPickerFields,
    dateFields,
    emailFields,
    jsonFields,
    numberFields,
    textAreaFields,
    urlFields,
} from "../../db/schema/index.js";

export async function deleteTextField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(textFields)
            .where(eq(textFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting text field",
            origin: "backend/fieldRouter/text_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteTextareaField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(textAreaFields)
            .where(eq(textAreaFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting textarea field",
            origin: "backend/fieldRouter/textarea_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteNumberField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(numberFields)
            .where(eq(numberFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting number field",
            origin: "backend/fieldRouter/number_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteMultiSelectField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(multiSelectFields)
            .where(eq(multiSelectFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting multi select field",
            origin: "backend/fieldRouter/multi_select_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteSingleSelectField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(singleSelectFields)
            .where(eq(singleSelectFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting singel select field",
            origin: "backend/fieldRouter/single_select_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteColorPickerField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(colorPickerFields)
            .where(eq(colorPickerFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting color picker field",
            origin: "backend/fieldRouter/color_picker_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteDateField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(dateFields)
            .where(eq(dateFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting date field",
            origin: "backend/fieldRouter/date_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteEmailField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(emailFields)
            .where(eq(emailFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting email field",
            origin: "backend/fieldRouter/email_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteJsonField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(jsonFields)
            .where(eq(jsonFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting json field",
            origin: "backend/fieldRouter/json_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function deleteUrlField(req, res) {
    const { field_id } = req.params;

    try {
        const response = await db
            .delete(urlFields)
            .where(eq(urlFields.field_id, field_id));
        res.status(200).json(response);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in deleting url field",
            origin: "backend/fieldRouter/url_field/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
