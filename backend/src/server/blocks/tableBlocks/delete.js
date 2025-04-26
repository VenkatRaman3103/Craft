import { eq } from "drizzle-orm";
import { tableBlocks } from "../../../db/schema/blocks/tableBlocks/schema.js";
import { db } from "../../server.js";

export const deleteTable = async (req, res) => {
    const { block_id } = req.params;

    try {
        const tableResponse = await db
            .delete(tableBlocks)
            .where(eq(tableBlocks.block_id, block_id))
            .returning();
        res.json(tableResponse);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteTable/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
