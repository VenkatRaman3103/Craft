import { eq } from "drizzle-orm";
import { tableRows } from "../../../../db/schema/blocks/tableBlocks/tableRows/schema.js";
import { db } from "../../../server.js";

export const updateRowValue = async (req, res) => {
    const { row_id } = req.params;

    const { value } = req.body;

    try {
        const rowResponse = await db
            .update(tableRows)
            .set({
                value,
            })
            .where(eq(tableRows.row_id, row_id))
            .returning();
        res.json(rowResponse[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateRowValue/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
