import { and, eq } from "drizzle-orm";
import { db } from "../../../server.js";
import { tableEntries } from "../../../../db/schema/index.js";

export const updateEntryValue = async (req, res) => {
    const { row_id, column_id } = req.params;
    const { value } = req.body;

    try {
        const entryResponse = await db
            .update(tableEntries)
            .set({
                value,
            })
            .where(
                and(
                    eq(tableEntries.row_id, row_id),
                    eq(tableEntries.column_id, column_id),
                ),
            )
            .returning();
        res.json(entryResponse[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateRowValue/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
