import { eq } from "drizzle-orm";
import { arrayBlockItems } from "../../../../db/schema/blocks.js";
import { db } from "../../../server.js";

export async function deleteBlockByReference(req, res) {
    const { reference_id } = req.params;
    try {
        const deletedBlock = await db
            .delete(arrayBlockItems)
            .where(eq(arrayBlockItems.reference_id, reference_id))
            .returning();

        res.json(deletedBlock);
    } catch (error) {
        const errorMessage = {
            error,
            message: `Error in deleting the block: ${reference_id}`,
            origin: "backend/arrayBlockItemsRoute/deleteBlockByReference/DELETE",
        };
        if (error.code === "P2002") {
            res.status(400).json(errorMessage);
        }
        res.status(500).json(errorMessage);
    }
}
