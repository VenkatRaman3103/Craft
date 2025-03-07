import { db } from "../server.js";
import { textFields } from "../../db/schema/fields.js";

export async function readTextFields(req, res) {
    try {
        const allTextFields = await db.select().from(textFields);
        res.status(200).json(allTextFields);
    } catch (error) {
        const errorMessage = {
            error,
            message: "Error in fetching text fields",
            origin: "backend/fieldsRouter/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
