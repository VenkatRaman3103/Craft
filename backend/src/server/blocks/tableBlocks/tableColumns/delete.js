import { eq } from "drizzle-orm";
import { tableColumns } from "../../../../db/schema/blocks/tableBlocks/tableColumns/schema.js";
import { db } from "../../../server.js";

export const deleteColumn = async (req, res) => {
    const { column_id } = req.params;
    try {
        const column = await db
            .delete(tableColumns)
            .where(eq(tableColumns.column_id, column_id))
            .returning();

        res.json(column[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/deleteColum/delete/DELETE",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
