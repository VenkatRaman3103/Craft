import { eq } from "drizzle-orm";
import { tableRows } from "../../../../db/schema/blocks/tableBlocks/tableRows/schema.js";
import { db } from "../../../server.js";

export const deleteRows = async (req, res) => {
    const { table_id } = req.params;

    try {
        const deletedRows = await db
            .delete(tableRows)
            .where(eq(tableRows.table_id, table_id))
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

export const deleteRow = async (req, res) => {
    const { row_id } = req.params;

    try {
        const deletedRow = await db
            .delete(tableRows)
            .where(eq(tableRows.row_id, row_id))
            .returning();

        res.json(deletedRow);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteRow/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
