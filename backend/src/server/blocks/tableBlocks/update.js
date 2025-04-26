import { eq } from "drizzle-orm";
import { tableBlocks } from "../../../db/schema/blocks/tableBlocks/schema.js";
import { db } from "../../server.js";

export const updateTableName = async (req, res) => {
    const { block_id } = req.params;
    const { name } = req.body;
    try {
        const tableResponse = await db
            .update(tableBlocks)
            .set({ name })
            .where(eq(tableBlocks.block_id, block_id))
            .returning();
        res.json(tableResponse[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateTableName/patch/GET",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
