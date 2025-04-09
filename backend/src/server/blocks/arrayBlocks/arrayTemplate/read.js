import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";

export async function getArrayBlockTemplate(req, res) {
    try {
        const response = await db.select().from(arrayBlockTemplates);
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/getArrayBlockTemplate/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
