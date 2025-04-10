import { eq } from "drizzle-orm";
import { arrayBlockTemplates } from "../../../../db/schema/blocks/arrayBlocks/arrayTemplates/schema.js";
import { db } from "../../../server.js";

export async function updateArrayTemplteName(req, res) {
    const { template_id } = req.params;
    const { name } = req.body;
    try {
        const response = await db
            .update(arrayBlockTemplates)
            .set({ name })
            .where(eq(arrayBlockTemplates.template_id, template_id));

        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/updateArrayTemplteName/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}

export async function updateArrayTemplteDescription(req, res) {
    const { template_id } = req.params;
    const { description } = req.body;
    try {
        const response = await db
            .update(arrayBlockTemplates)
            .set({ description })
            .where(eq(arrayBlockTemplates.template_id, template_id));

        res.json(response);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/arrayBlocks/updateArrayTemplteDescription/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
}
