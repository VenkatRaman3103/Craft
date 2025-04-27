import { eq } from "drizzle-orm";
import { tableRows } from "../../../../db/schema/blocks/tableBlocks/tableRows/schema.js";
import { db } from "../../../server.js";

export const deleteRows = async (req, res) => {
    const { column_id } = req.params;

    try {
        const deletedRows = await db
            .delete(tableRows)
            .where(eq(tableRows.column_id, column_id))
            .returning();

        const cleanedRows = deletedRows.map((row) => ({
            ...row,
        }));

        res.json(cleanedRows);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteRows/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
