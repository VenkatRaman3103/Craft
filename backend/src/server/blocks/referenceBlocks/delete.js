import { eq } from "drizzle-orm";
import { referenceBlock } from "../../../db/schema/blocks/referenceBlock/schema.js";
import { db } from "../../server.js";

export const deleteReferenceBlock = async (req, res) => {
    const { block_id } = req.params;
    try {
        const deletedBlock = await db
            .delete(referenceBlock)
            .where(eq(referenceBlock.block_id, block_id))
            .returning();
        res.json(deletedBlock[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteReferenceBlock/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
