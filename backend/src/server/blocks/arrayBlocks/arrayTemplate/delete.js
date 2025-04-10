import { eq } from "drizzle-orm";
import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";

export async function deleteArrayTemplate(req, res) {
    const { template_id } = req.params;

    try {
        const response = await db
            .delete(arrayBlockTemplates)
            .where(eq(arrayBlockTemplates.template_id, template_id));
        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/deleteArrayTemplate/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
