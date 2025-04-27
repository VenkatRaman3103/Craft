import { eq } from "drizzle-orm";
import { tableColumns } from "../../../../db/schema/blocks/tableBlocks/tableColumns/schema.js";
import { db } from "../../../server.js";

export const updateColumnValue = async (req, res) => {
    const { column_id } = req.params;

    const { value } = req.body;

    try {
        const columnResponse = await db
            .update(tableColumns)
            .set({
                value,
            })
            .where(eq(tableColumns.column_id, column_id))
            .returning();
        res.json(columnResponse[0]);
    } catch (error) {
        const errorMessage = {
            error: error.message,
            origin: "backend/updateColumnValue/update/PATCH",
        };
        console.log(errorMessage);
        res.status(500).json(errorMessage);
    }
};
