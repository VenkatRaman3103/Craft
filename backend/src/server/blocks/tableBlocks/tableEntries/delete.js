import { and, eq } from "drizzle-orm";
import { tableEntries } from "../../../../db/schema/blocks/tableBlocks/tableEntries/schema.js";
import { db } from "../../../server.js";

export const deleteEntriesByRowId = async (req, res) => {
    const { row_id } = req.params;
    try {
        const result = await db
            .delete(tableEntries)
            .where(eq(tableEntries.row_id, row_id));

        res.json(result);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteEntriesByRowId/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const deleteEntriesByColumnId = async (req, res) => {
    const { column_id } = req.params;
    try {
        const result = await db
            .delete(tableEntries)
            .where(eq(tableEntries.column_id, column_id));

        res.json(result);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteEntriesByColumnId/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};

export const deleteEntries = async (req, res) => {
    const { column_id, row_id } = req.params;
    try {
        const result = await db
            .delete(tableEntries)
            .where(
                and(
                    eq(tableEntries.column_id, column_id),
                    eq(tableEntries.row_id, row_id),
                ),
            );

        res.json(result);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteEntries/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
