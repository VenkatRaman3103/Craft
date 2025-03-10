import { eq } from "drizzle-orm";
import { textFields } from "../../db/schema/fields.js";
import { db } from "../server.js";

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
